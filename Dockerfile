# Undangan Digital — Apache + PHP 8.3 (pdo_sqlite sudah bawaan image resmi)
FROM php:8.3-apache

# remoteip: baca IP asli tamu dari reverse proxy (untuk jeda kirim per IP)
# expires/headers: cache aset statis
RUN a2enmod remoteip expires headers \
 && sed -ri 's/^ServerTokens .*/ServerTokens Prod/; s/^ServerSignature .*/ServerSignature Off/' /etc/apache2/conf-available/security.conf

COPY docker/apache-undangan.conf /etc/apache2/conf-available/undangan.conf
COPY docker/php-undangan.ini /usr/local/etc/php/conf.d/undangan.ini
RUN a2enconf undangan

WORKDIR /var/www/html
COPY --chown=www-data:www-data index.html .nojekyll ./
COPY --chown=www-data:www-data assets ./assets
COPY --chown=www-data:www-data api ./api

# Database ucapan disimpan di volume agar tidak hilang saat container dibuat ulang
RUN chown -R www-data:www-data /var/www/html/api/data && chmod 775 /var/www/html/api/data
VOLUME /var/www/html/api/data

# Pastikan folder database bisa ditulis PHP, juga pada volume yang baru dibuat.
CMD ["sh", "-c", "chown www-data:www-data /var/www/html/api/data && exec apache2-foreground"]

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -fsS http://localhost/api/ucapan.php >/dev/null || exit 1

EXPOSE 80
