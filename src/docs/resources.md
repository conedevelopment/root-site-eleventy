---
title: "Resources"
github: "https://github.com/conedevelopment/root-docs/blob/master/resources.md"
order: 3
---

Resources are basically extra layers around models. Using resources it's easy to build up a CRUD workflow for a model, using [fields](/docs/fields), [filters](/docs/filters), [actions](/docs/actions) or [widgets](/docs/widgets).

## Creating Resources

You may create a Resource class using the `root:resource` artisan command. It requires only a name as its parameter and generates the resource class for the model:

```sh
php artisan root:resource PostResource

# or

php artisan root:resource CustomPostResource --model=Post
```

## Registering Resources

Root automatically registers the resources found in the `app/Root/Resources` directory. However you may store resources somewhere else or also you may want to register a resource manually:

```php
namespace App\Providers;

use Cone\Root\Root;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Discover in custom directory
        Root::instance()->resources->discoverIn([
            app_path('Path/To/Resources'),
        ]);

        // Register manually
        Root::instance()->resources->register([
            new \App\Root\Resources\ProductResource,
        ]);
    }
}
```

## Configuration

You may allow or disallow interaction with resources. To do so, you can call the `authorize` method on the resource instance:

```php
$resource->authorize(static function (Request $request): bool {
    return $request->user()->isAdmin();
});
```

### Fields

> For the detailed documentation visit the [fields](/docs/fields) section.

Fields are handlers for the model attributes. They are responsible for saving and displaying the given attribute of the resource model. You can easily define fields on your resource by using the `fields` method:

```php
use Cone\Root\Fields\ID;
use Cone\Root\Fields\Text;
use Cone\Root\Resources\Resource;
use Illuminate\Http\Request;

class PostResource extends Resource
{
    /**
     * Define the fields for the resource.
     */
    public function fields(Request $request): array
    {
        return [
            ID::make(),
            Text::make('Title'),
        ];
    }
}
```

### Filters

> For the detailed documentation visit the [filters](/docs/filters) section.

Filters are responsible for transforming the current request to a database query. You can easily define filters on your resource by using the `filters` method:

```php
use App\Root\Filters\Category;
use Cone\Root\Resources\Resource;
use Illuminate\Http\Request;

class PostResource extends Resource
{
    /**
     * Define the filters for the resource.
     */
    public function filters(Request $request): array
    {
        return array_merge(parent::filters($request), [
            Category::make(),
        ]);
    }
}
```

### Actions

> For the detailed documentation visit the [actions](/docs/actions) section.

Actions are responsible for performing a specific action on a set of models. You can easily define actions on your resource by using the `actions` method:

```php
use App\Root\Actions\Publish;
use Cone\Root\Resources\Resource;
use Illuminate\Http\Request;

class PostResource extends Resource
{
    /**
     * Define the actions for the resource.
     */
    public function actions(Request $request): array
    {
        return [
            Publish::make(),
        ];
    }
}
```

### Widgets

> For the detailed documentation visit the [widgets](/docs/widgets) section.

Widgets are cards that hold some information or any content you want to display. You can easily define widgets on your resource by using the `widgets` method:

```php
use App\Root\Widgets\TotalPosts;
use Cone\Root\Resources\Resource;
use Illuminate\Http\Request;

class PostResource extends Resource
{
    /**
     * Define the widgets for the resource.
     */
    public function widgets(Request $request): array
    {
        return [
            TotalPosts::make(),
        ];
    }
}
```
