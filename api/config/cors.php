<?php

return [
    // Nginx gestiona CORS, pero si Laravel también lo interpreta,
    // hay que asegurarse de NO usar wildcard con credentials
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://204.168.246.63:5173',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
