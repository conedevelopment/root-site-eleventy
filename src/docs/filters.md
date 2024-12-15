---
title: "Filters"
github: "https://github.com/conedevelopment/root-docs/blob/master/filters.md"
order: 6
---

Filters are responsible for transforming the current request to a database query.

## Creating Filters

You can generate new filter classes by calling the `root:filter` artisan command:

```sh
php artisan root:filter Category
```

## Registering Filters

You can register filters in resources and extracts, by using the `filters` method.

```php
use App\Root\Filters\Category;
use Illuminate\Http\Request;

/**
 * Define the filters for the resource.
 */
public function filters(Request $request): array
{
    return [
        Category::make(),
    ];
}
```

## Configuration

### Options

Filters have an `option` method, where you can define the selectable options:

```php
namespace App\Root\Filters;

use Cone\Root\Filters\Filter;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;

class Category extends Filter
{
    /**
     * Apply the filter on the query.
     */
    public function apply(Request $request, Builder $query, mixed $value): Builder
    {
        return $query->where('category', $value);
    }

    /**
     * Get the filter options.
     */
    public function options(Request $request): array
    {
        return [
            'product' => 'Product',
            'service' => 'Service',
        ];
    }
}
```

Also, you may configure a select filter with multiple selectable choices. To do so, call the `multiple` method on the filter instance:

```php
Category::make()->multiple();
```

### Authorization

You may allow or disallow interaction with filters. To do so, you can call the `authorize` method on the filter instance:

```php
$filter->authorize(static function (Request $request): bool {
    return $request->user()->isAdmin();
});
```
