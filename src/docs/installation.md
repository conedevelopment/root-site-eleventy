---
title: "Installation"
github: "https://github.com/conedevelopment/root-docs/blob/master/installation.md"
order: 1
---

## Requirements

Before moving on, please check out the [Laravel documentation](https://laravel.com/docs/master/installation) about its installation, requirements, and configuration.

Requirements:

- PHP `8.2+`
- PHP `GD` and `EXIF` extensions
- Laravel `^11.0`

## Installation

```sh
laravel new app

composer require conedevelopment/root
```

### Running the Install Command

After installing the package, run the `root:install` command. It will run the migrations and publish the compiled assets that you may override later.

> Please note: if you are using Windows, you might open your terminal or development environment as a system administrator.

Also, you may populate your local database with _fake_ data. To do so, pass the `--seed` flag to the command.

```sh
php artisan install:root --seed
```

### Publishing Assets

You may want to customize the JS and SASS files. To do so, run the `root:publish --tag=root-vendor` command.

```sh
php artisan root:publish --tag=root-vendor

yarn install && yarn dev
```

### Preparing Storage

Root comes with a media manager out of the box. If you are using the `public` driver, you may link your storage directory to make your media files visible for users.

```sh
php artisan storage:link
```

### Extending the User Model

Root comes with a `Cone\Root\Models\User` model by default, that provides some functionality. Also, it brings the default authentication services; you may keep clean your `App\Models\User` model and extend the one that comes with Root:

```php
namespace App\Models;

use Cone\Root\Models\User as Model;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Model implements MustVerifyEmail
{
    //
}
```

### Configuration

You may override the default configuration. To do so, publish the configuration file:

```sh
php artisan root:publish --root-config
```

You can find freshly published config in the `config/root.php` file.
