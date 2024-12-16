---
title: "Actions"
github: "https://github.com/conedevelopment/root-docs/blob/master/actions.md"
order: 6
---

Actions are runnable tasks on a given collection of models. Actions can be registered in resources and extracts. Also, actions are easily configurable and customizable for the current user.

## Creating Actions

You can generate new action classes by calling the `root:action` artisan command:

```sh
php artisan root:action SendPasswordResetNotification
```

## Registering Actions

You can register actions in resources and extracts, by using the `actions` method.

```php
use App\Root\Actions\SendPasswordResetNotification;
use Illuminate\Http\Request;

/**
 * Define the actions for the resource.
 */
public function actions(Request $request): array
{
    return [
        new SendPasswordResetNotification,
    ];
}
```

## Configuration

### Fields

> For the detailed documentation visit the [fields](/docs/fields) section.

You may define fields for any action:

```php
use Cone\Root\Actions\Action;
use Cone\Root\Fields\Date;
use Illuminate\Http\Request;

class Publish extends Action
{
    /**
     * Define the fields for the action.
     */
    public function fields(Request $request): array
    {
        return [
            Date::make('Published at')->withTime(),
        ];
    }
}
```

> When running the action, the submitted form data will be accessible in the `Request` object passed to the action's `handle` method.

### Authorization

You may allow or disallow interaction with actions. To do so, you can call the `authorize` method on the action instance:

```php
$action->authorize(static function (Request $request): bool {
    return $request->user()->can('batchPublish', Post::class);
});
```

### Visibility

You may show or hide actions based on the current resource view. For example, some actions might be visible on the `index` page, while others should be hidden. You can easily customize the action visibility logic using the `visibleOn` and `hiddenOn` methods:

```php
$field->visibleOn(['index', 'show']);

$field->hiddenOn(['update', 'create']);
```

### Destructive Actions

You may mark an action as destructive. That means, the `Run` button that performs the action becomes red, indicating it is a dangerous action to run.

```php
$action->destructive();
```

### Confirmable Actions

You may mark an action as confirmable. That means, when pressing the `Run` button, the user receives a confirmation popup. If it's been cancelled, the action won't run.

```php
$action->confirmable();
```

### Standalone Actions

You may mark an action as standalone. That means, the action does not need any selected models. Also, the `$models` collection in the `handle` method will be empty.

```php
$action->standalone();
```
