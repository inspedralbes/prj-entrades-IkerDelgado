FROM php:8.4-fpm-alpine

# Instal·lar dependències del sistema i eines de compilació per a extensions
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    $PHPIZE_DEPS

# Instal·lar extensions de PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Instal·lar Redis via PECL
RUN pecl install redis && docker-php-ext-enable redis

# Netejar eines de compilació per estalviar espai (opcional)
RUN apk del $PHPIZE_DEPS

# Obtenir Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

EXPOSE 9000
CMD ["php-fpm"]
