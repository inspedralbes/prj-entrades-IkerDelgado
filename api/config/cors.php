<?php

return [
    // Nginx gestiona CORS completamente.
    // paths vacío = Laravel NO añade ninguna cabecera CORS (evita duplicados)
    'paths' => [],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
