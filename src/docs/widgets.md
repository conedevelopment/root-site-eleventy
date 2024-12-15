---
title: "Widgets"
github: "https://github.com/conedevelopment/root-docs/blob/master/widgets.md"
order: 7
---

Widgets are cards that hold some information or any content you want to display.

## Creating Widgets

You can generate new action classes by calling the `root:widget` artisan command:

```sh
php artisan root:widget PostCount
```

## Registering Widgets

You can register actions in resources and extracts, by using the `widgets` method.

```php
use App\Root\Widgets\PostCount;
use Illuminate\Http\Request;

/**
 * Define the widgets for the resource.
 */
public function widgets(Request $request): array
{
    return array_merge(parent::widgets($request), [
        PostCount::make(),
    ]);
}
```

## Configuration

### Authorization

You may allow or disallow interaction with widgets. To do so, you can call the `authorize` method on the widget instance:

```php
$widget->authorize(static function (Request $request): bool {
    return $request->user()->can('viewPostCount');
});
```

### Visibility

You may show or hide widgets based on the current resource view. For example, some widgets might be visible on the index page, while others should be hidden. You can easily customize the action visibility logic using the `visibleOn` and `hiddenOn` methods:

```php
$field->visibleOn(['index']);

$field->hiddenOn(['index']);
```

### Blade Templates

A widget class must have a valid template property, that holds a real blade template:

```php
use Cone\Root\Widgets\Widget;

class PostCount extends Widget
{
    /**
     * The Blade template.
     */
    protected string $template = 'widgets.post-count;
}
```

## Widget Data

You can customize the data passed to the blade template by using the `data` method:

```php
use App\Models\Post;
use Cone\Root\Widgets\Widget;
use Illuminate\Http\Request;

class PostCount extends Widget
{
    /**
     * Get the data.
     */
    public function data(Request $request): array
    {
        return array_merge(parent::data($request), [
            'count' => Post::query()->count(),
        ]);
    }
}
```
