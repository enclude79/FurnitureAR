# Техническое задание: Миграция на Supabase

## Общая информация

Проект: FurnitureAR Telegram Mini App  
Дата начала: 14.01.2026  
Статус: В процессе реализации  

## Описание задачи

Полная миграция приложения от mock данных (`mockData.js`) к Supabase для персистентного хранения данных пользователей и каталога мебели.

## Архитектурные решения

### Аутентификация
- Используется только Telegram User ID для идентификации
- Supabase Auth не используется
- При первом входе пользователь автоматически создается в базе

### Storage
- Supabase Storage для хранения изображений товаров
- Bucket: `product-images` (публичный доступ)
- Текущие изображения хранятся как внешние URLs (placeholder.com)

### Security
- Row Level Security (RLS) не настраивается на первом этапе
- Real-time подписки не используются
- Все операции выполняются через публичный `ANON_KEY`

## Структура базы данных

### Таблицы

#### 1. users
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  photo_url TEXT,
  language_code VARCHAR(10) DEFAULT 'ru',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
```

#### 2. categories
```sql
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
CREATE INDEX idx_categories_active ON categories(is_active, sort_order);
```

#### 3. products
```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  is_new BOOLEAN DEFAULT false,
  on_sale BOOLEAN DEFAULT false,
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  delivery_time VARCHAR(100),
  specifications JSONB,
  features JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_new ON products(is_new) WHERE is_new = true;
CREATE INDEX idx_products_sale ON products(on_sale) WHERE on_sale = true;
CREATE INDEX idx_products_rating ON products(rating DESC);
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('russian', title || ' ' || description));
```

#### 4. product_images
```sql
CREATE TABLE product_images (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
CREATE INDEX idx_product_images_product ON product_images(product_id, sort_order);
CREATE INDEX idx_product_images_primary ON product_images(product_id, is_primary) WHERE is_primary = true;
```

#### 5. favorites
```sql
CREATE TABLE favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, product_id)
);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_product ON favorites(product_id);
```

#### 6. user_activity
```sql
CREATE TABLE user_activity (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
CREATE INDEX idx_activity_user ON user_activity(user_id, created_at DESC);
CREATE INDEX idx_activity_type ON user_activity(activity_type);
```

#### 7. user_stats
```sql
CREATE TABLE user_stats (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  total_items INT DEFAULT 0,
  total_views INT DEFAULT 0,
  total_likes INT DEFAULT 0,
  total_reviews INT DEFAULT 0,
  points INT DEFAULT 0,
  level VARCHAR(100) DEFAULT 'Новичок',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
CREATE INDEX idx_user_stats_user ON user_stats(user_id);
```

## SQL команды для выполнения в Supabase

### Фаза 1: Создание таблиц

Выполнить все SQL команды из раздела "Структура базы данных" выше.

### Фаза 2: Тригеры для автоматического обновления timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Фаза 3: Вставка тестовых данных

#### Категории
```sql
INSERT INTO categories (id, code, name, icon, is_active, sort_order) VALUES
  (1, 'all', 'Все', '🏠', true, 0),
  (2, 'sofas', 'Диваны', '🛋️', true, 1),
  (3, 'tables', 'Столы', '🪵', true, 2),
  (4, 'chairs', 'Кресла', '🪑', true, 3),
  (5, 'cabinets', 'Шкафы', '📚', true, 4),
  (6, 'beds', 'Кровати', '🛏️', true, 5);

SELECT setval('categories_id_seq', 6, true);
```

#### Товары
```sql
INSERT INTO products (id, title, description, category_id, price, original_price, is_new, on_sale, rating, reviews_count, in_stock, delivery_time, specifications, features) VALUES
  (1, 'Угловой диван "Комфорт"', 'Удобный 3-местный угловой диван с мягкими подушками и прочным каркасом. Идеально подходит для просторных гостиных. Обивка из качественной износостойкой ткани.', 2, 45000.00, NULL, true, false, 4.90, 123, true, '2-3 рабочих дня', 
    '{"Материал": "Велюр премиум", "Размеры": "280x180x85 см", "Вес": "95 кг", "Цвет": "Серый"}'::jsonb,
    '["Раскладной механизм", "Ортопедическое основание", "Съемные чехлы", "Бельевой ящик", "Гарантия 2 года"]'::jsonb),
  
  (2, 'Диван-кровать "Модерн"', 'Раскладной диван с ортопедическим матрасом', 2, 38000.00, 52000.00, false, true, 4.70, 89, true, '2-3 рабочих дня',
    '{"Материал": "Текстиль", "Размеры": "200x90x85 см", "Вес": "75 кг", "Цвет": "Синий"}'::jsonb,
    '["Механизм трансформации", "Ортопедический матрас", "Бельевой ящик"]'::jsonb),
  
  (3, 'Обеденный стол "Классик"', 'Стол из массива дуба на 6 персон', 3, 28000.00, NULL, true, false, 4.80, 67, true, '1-2 рабочих дня',
    '{"Материал": "Массив дуба", "Размеры": "180x90x75 см", "Вес": "45 кг", "Цвет": "Натуральный"}'::jsonb,
    '["Массив дерева", "Защитное покрытие", "Регулируемые ножки"]'::jsonb),
  
  (4, 'Журнальный столик "Лофт"', 'Стильный журнальный столик в индустриальном стиле. Сочетание металла и натурального дерева создает уникальный дизайн.', 3, 12000.00, 16000.00, false, true, 4.60, 56, true, '1-2 рабочих дня',
    '{"Материал": "Дуб + металл", "Размеры": "100x60x45 см", "Вес": "18 кг", "Цвет": "Орех"}'::jsonb,
    '["Натуральное дерево", "Металлический каркас", "Нижняя полка для хранения", "Защитное покрытие", "Легко чистится"]'::jsonb),
  
  (5, 'Кресло "Релакс"', 'Мягкое кресло с подставкой для ног', 4, 18000.00, NULL, true, false, 4.50, 45, true, '3-5 рабочих дней',
    '{"Материал": "Экокожа", "Размеры": "80x85x100 см", "Вес": "25 кг", "Цвет": "Бежевый"}'::jsonb,
    '["Механизм качания", "Подставка для ног", "Эргономичная спинка"]'::jsonb),
  
  (6, 'Офисное кресло "Эрго"', 'Эргономичное кресло для работы', 4, 9500.00, 12000.00, false, true, 4.40, 78, true, '3-5 рабочих дней',
    '{"Материал": "Сетка + пластик", "Размеры": "60x60x110 см", "Вес": "15 кг", "Цвет": "Черный"}'::jsonb,
    '["Регулировка высоты", "Поясничная поддержка", "Дышащая спинка"]'::jsonb),
  
  (7, 'Шкаф-купе "Премиум"', 'Вместительный шкаф с зеркалом', 5, 55000.00, NULL, true, false, 4.80, 92, true, '5-7 рабочих дней',
    '{"Материал": "ЛДСП + зеркало", "Размеры": "220x60x240 см", "Вес": "120 кг", "Цвет": "Белый"}'::jsonb,
    '["Раздвижные двери", "Зеркало", "Полки и штанги", "LED подсветка"]'::jsonb),
  
  (8, 'Комод "Скандинавия"', 'Вместительный комод в скандинавском стиле', 5, 16000.00, NULL, false, false, 4.70, 34, true, '3-5 рабочих дней',
    '{"Материал": "МДФ", "Размеры": "100x45x80 см", "Вес": "35 кг", "Цвет": "Белый"}'::jsonb,
    '["4 выдвижных ящика", "Плавное закрывание", "Стильный дизайн"]'::jsonb),
  
  (9, 'Кровать "Люкс" 160x200', 'Двуспальная кровать с подъемным механизмом', 6, 42000.00, 55000.00, false, true, 4.90, 115, true, '5-7 рабочих дней',
    '{"Материал": "ЛДСП + ткань", "Размеры": "210x175x95 см", "Вес": "85 кг", "Цвет": "Серый"}'::jsonb,
    '["Подъемный механизм", "Большой бельевой ящик", "Ортопедическое основание"]'::jsonb),
  
  (10, 'Детская кровать "Облако"', 'Кровать с бортиками 80x160', 6, 22000.00, NULL, true, false, 4.60, 48, true, '3-5 рабочих дней',
    '{"Материал": "МДФ", "Размеры": "170x90x70 см", "Вес": "40 кг", "Цвет": "Белый"}'::jsonb,
    '["Защитные бортики", "Ортопедическое основание", "Безопасные материалы"]'::jsonb),
  
  (11, 'Прямой диван "Престиж"', 'Классический прямой диван', 2, 35000.00, NULL, false, false, 4.60, 71, true, '2-3 рабочих дня',
    '{"Материал": "Велюр", "Размеры": "220x90x85 см", "Вес": "70 кг", "Цвет": "Бежевый"}'::jsonb,
    '["Раскладной механизм", "Бельевой ящик", "Съемные подушки"]'::jsonb),
  
  (12, 'Рабочий стол "Профи"', 'Письменный стол с ящиками', 3, 15000.00, NULL, true, false, 4.70, 52, true, '1-2 рабочих дня',
    '{"Материал": "ЛДСП", "Размеры": "140x70x75 см", "Вес": "35 кг", "Цвет": "Венге"}'::jsonb,
    '["3 выдвижных ящика", "Кабель-менеджмент", "Просторная столешница"]'::jsonb);

SELECT setval('products_id_seq', 12, true);
```

#### Изображения товаров
```sql
INSERT INTO product_images (product_id, image_url, sort_order, is_primary) VALUES
  (1, 'https://via.placeholder.com/600x400/9c27b0/ffffff?text=Диван+Комфорт+1', 0, true),
  (1, 'https://via.placeholder.com/600x400/7b1fa2/ffffff?text=Диван+Комфорт+2', 1, false),
  (1, 'https://via.placeholder.com/600x400/6a1b9a/ffffff?text=Диван+Комфорт+3', 2, false),
  (2, 'https://via.placeholder.com/600x400/3f51b5/ffffff?text=Диван+Модерн', 0, true),
  (3, 'https://via.placeholder.com/600x400/4caf50/ffffff?text=Стол+Классик', 0, true),
  (4, 'https://via.placeholder.com/600x400/e91e63/ffffff?text=Столик+Лофт+1', 0, true),
  (4, 'https://via.placeholder.com/600x400/c2185b/ffffff?text=Столик+Лофт+2', 1, false),
  (4, 'https://via.placeholder.com/600x400/ad1457/ffffff?text=Столик+Лофт+3', 2, false),
  (5, 'https://via.placeholder.com/600x400/3390ec/ffffff?text=Кресло+Релакс', 0, true),
  (6, 'https://via.placeholder.com/600x400/00bcd4/ffffff?text=Кресло+Эрго', 0, true),
  (7, 'https://via.placeholder.com/600x400/795548/ffffff?text=Шкаф+Премиум', 0, true),
  (8, 'https://via.placeholder.com/600x400/2196f3/ffffff?text=Комод', 0, true),
  (9, 'https://via.placeholder.com/600x400/ff9800/ffffff?text=Кровать+Люкс', 0, true),
  (10, 'https://via.placeholder.com/600x400/ffeb3b/ffffff?text=Кровать+Облако', 0, true),
  (11, 'https://via.placeholder.com/600x400/673ab7/ffffff?text=Диван+Престиж', 0, true),
  (12, 'https://via.placeholder.com/600x400/009688/ffffff?text=Стол+Профи', 0, true);
```

## Инструкции для выполнения

### Шаг 1: Создание таблиц (РУЧНОЕ ВЫПОЛНЕНИЕ ПОЛЬЗОВАТЕЛЕМ)

1. Откройте [Supabase Dashboard](https://app.supabase.com)
2. Перейдите в ваш проект FurnitureAR
3. Откройте **SQL Editor**
4. Скопируйте и выполните все SQL команды из раздела "SQL команды для выполнения в Supabase"
5. Убедитесь, что все таблицы созданы успешно
6. Создайте Storage Bucket `product-images`:
   - Перейдите в **Storage** -> **New bucket**
   - Введите имя: `product-images`
   - Установите флаг **Public bucket**
   - Нажмите **Create bucket**

### Шаг 2: Проверка подключения (АВТОМАТИЧЕСКОЕ)

После создания таблиц, система автоматически:
1. Установит зависимость `@supabase/supabase-js`
2. Создаст Supabase клиент
3. Создаст сервисы для работы с БД
4. Создаст React хуки
5. Обновит все компоненты
6. Удалит старый файл `mockData.js`

## Параметры окружения

Используются следующие переменные из `.env.local`:

```
REACT_APP_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш-публичный-ключ
```

Получите эти значения из **Project Settings -> API** в Supabase Dashboard.

## Тестирование

После полной интеграции необходимо протестировать:

1. ✓ Загрузка категорий и товаров
2. ✓ Поиск и фильтрация товаров
3. ✓ Добавление/удаление из избранного
4. ✓ Просмотр деталей товара
5. ✓ Создание пользователя при первом входе
6. ✓ Загрузка профиля пользователя
7. ✓ Фильтрация по категориям

## Контрольный список

- [ ] SQL таблицы созданы в Supabase
- [ ] Тестовые данные вставлены
- [ ] Storage Bucket `product-images` создан
- [ ] Установлена зависимость `@supabase/supabase-js`
- [ ] Создан Supabase клиент (`src/lib/supabase.js`)
- [ ] Созданы все сервисы (`src/services/database/*`)
- [ ] Созданы все React хуки (`src/hooks/*`)
- [ ] Обновлены все компоненты экранов
- [ ] Удален файл `mockData.js`
- [ ] Проведено полное тестирование приложения

## Возможные проблемы и решения

### Проблема: CORS ошибки
**Решение**: Убедитесь, что в Supabase Settings включены CORS для вашего домена.

### Проблема: 401 ошибка при запросе к БД
**Решение**: Проверьте, что `NEXT_PUBLIC_SUPABASE_ANON_KEY` скопирован корректно.

### Проблема: Таблицы не видны в SQL Editor
**Решение**: Обновите страницу или выполните команду `SELECT * FROM information_schema.tables`

## Контакт

При возникновении проблем обратитесь к документации Supabase: https://supabase.com/docs
