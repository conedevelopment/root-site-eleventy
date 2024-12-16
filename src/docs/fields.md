---
title: "Fields"
github: "https://github.com/conedevelopment/root-docs/blob/master/fields.md"
order: 5
---

Fields are handlers for the model attributes. They are responsible for saving and displaying the given attribute of the resource model.

## Creating Fields

In some cases, the default fields are not enough, or don't provide the flexibility you need. In that scenario you can create your own custom fields easily. To generate a field easily you can call the following artisan command:

```sh
php artisan root:field Autocomplete
```

## Registering Fields

You can register fields in resources, extracts, actions and other fields by using the `fields` method.

```php
use Cone\Root\Fields\Text;
use Illuminate\Http\Request;

/**
 * Define the fields for the resource.
 */
public function fields(Request $request): array
{
    return [
        Text::make(__('Title'), 'title'),
    ];
}
```

## Configuration

### Value Resolution

Field values are extracted from the given model's attributes. The attribute that is matching with the name of the field will be injected into the field when displaying or converting it into a form input.

It may happen that the attribute does not exists on the model that matches with the field, or its value needs to be converted before using it from the field. In that case you may define a default value resolver on your field instance:

```php
use Cone\Root\Fields\Text;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

Text::make('Title')
    ->value(static function (Request $request, Model $model, mixed $value): string {
        return is_null($value) ? 'foo' : $value;
    });
```

> Alternatively, you may do default value definitions on your model directly.

### Formatting Value

You may define custom value formatters for the field values. In that case you can easily define a format resolver with the `format` method:

```php
use Cone\Root\Fields\Number;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Number;

Number::make('Price')
    ->format(static function (Request $request, Model $model, mixed $value): string {
        return Number::currency($value);
    });
```

### Value Hydration

You may define custom value hydration logic on your field. To do so, use the `hydrate` method passing a `Closure`:

```php
use Cone\Root\Fields\Number;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Number;

Number::make('Price')
    ->hydrate(static function (Request $request, Model $model, mixed $value): void {
        $model->setAttribute('price', $value);
    });
```

### Authorization

You may allow/disallow interaction with fields. To do so, you can call the `authorize` method on the field instance:

```php
use Illuminate\Http\Request;

$field->authorize(static function (Request $request, Model $model): bool {
    return $request->user()->isAdmin();
});
```

### Visibility

You may show or hide fields based on the current resource view. For example, some fields might be visible on the `index` page, while others should be hidden. You can easily customize the action visibility logic using the `visibleOn` and `hiddenOn` methods:

```php
$field->visibleOn(['index', 'show']);

$field->hiddenOn(['update', 'create']);
```

### Validation

You may define validation rules for your field instances. To do so, you can call the `rules`, `createRules` and `updateRules` on the field instance:

```php
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

$field->rules(['string', 'required'])
    ->createRules(['unique:posts'])
    ->updateRules(static function (Request $request, Model $model): array {
        return [Rule::unique('posts')->ignoreModel($model)];
    });
```

> You can pass an `array` or a `Closure` to the rule methods.

The value passed to the `rules` method will be present for both creating and updating models.

### Searchable and Sortable Fields

On index or extract views you may want to filter the results by sorting or searching any desired fields. To do so you can call the `sortable` and the `searchable` methods on your field instance:

```php
$field->sortable();
$field->sortable(false);

$field->searchable();
$field->searchable(false);
```

### Translatable Fields

## Generic Fields

### Boolean

The `Boolean` field is typically a handler for `boolean` model attributes:

> Don't forget to [cast](https://laravel.com/docs/master/eloquent-mutators#attribute-casting) you model attribute as a `boolean`.

```php
$field = Boolean::make(__('Enabled'), 'enabled');
```

### Checkbox

The `Checkbox` field is typically a handler for `json` model attributes (array of values):

> Don't forget to [cast](https://laravel.com/docs/master/eloquent-mutators#attribute-casting) you model attribute as a `json` or `array`.

```php
$field = Checkbox::make(__('Permissions'), 'permissions')
    ->options([
        'view' => 'view',
        'create' => 'Create',
        'update' => 'Update',
        'delete' => 'Delete',
    ]);
```

You may also pass a `Closure` to customize the resolution logic of the options, see the [`Select`](#select) field.

### Color

The `Color` field is typically a handler for `color` model attributes:

```php
$field = Color::make(__('Background Color'), 'bg_color');
```

> You may use the `hex_color` validation rule for this field. By default no rules attached.

### Date

The `Date` field is typically a handler for `date` or `datetime` model attributes:

```php
$field = Date::make(__('Expires at'), 'expires_at');
```

> You may use the `date` validation rule for this field. By default no rules attached.

You can also apply modifiers on a `Date` field:

```php
// Adds/removes a time handler for the field
$field->withTime();
$field->withTime(false);

// Sets the displayed timezone for the input
// Note, the value is saved to the database in the app's timezone (normally UTC)
$field->timezone('Europe/Budapest');

// Adds the "step" HTML input attribute
$field->step(1);

// Adds the "min" HTML input attribute
$field->min('2024-01-01');
$field->min(now()->addDays(7));

// Adds the "max" HTML input attribute
$field->max('2024-01-01');
$field->max(now()->addDays(7));
```

### Dropdown

The `Dropdown` field is turbo-charded version of the [`Select`](#select) field. You may checkout its documentation.

```php
$field  = Dropdown::make(__('Tags'), 'tags')
    ->options([
        'bug' => 'Bug',
        'info' => 'Info',
        'question' => 'Question',
    ]);
```

### Editor

The `Editor` field is typically a handler for `text` model attributes (HTML). The `Editor` field is a [Tiptap](https://tiptap.dev/product/editor) editor combined with [alpine](https://alpinejs.dev/):

```php
$field = Editor::make(__('Content'), 'content');
```

The `root.php` config file contains the default configuration for each editor instance. You may edit the config file or you can also customize the configuration per instance:

```php
$field->withConfig(static function (array $config): array {
    return array_merge($config, ['autofocus' => true]);
});
```

It is also possible using the [Media Library](#media) with the `Editor` field to insert existing media files or upload new ones:

```php
$field->withMedia();

// or you may customize the media field
$field->withMedia(static function (Media $media): void {
    $media->withRelatableQuery(static function (Request $request, Builder $query): Builder {
        return $query->where('user_id', $request->user()->getKey());
    });
});
```

You can also apply modifiers on a `Editor` field:

```php
// Sets the editor height
$field->height('300px');
```

### Email

The `Email` field is typically a handler for `email` model attributes:

```php
$field = Email::make(__('Billing Email'), 'billing_email');
```

> You may use the `email` validation rule for this field. By default no rules attached.

### Fieldset

The `Fieldset` field a handler for grouped sub-fields. Also, it renders its fields into a `<fieldset>` HTML element:

```php
$group = Fieldset::make(__('Billing Fields'), 'billing')
    ->withFields(static function (): array {
        return [
            Text::make(__('Name'), 'billing_name'),
            Email::make(__('Email'), 'billing_email'),
        ];
    });
```

### Hidden

The `Hidden` field is eqvivalent to a simple `Field` instance, however it automatically gets a `type="hidden"` HTML attribute, that makes it uneditable:

```php
$field = Hidden::make(__('Token'), 'token')
    ->default(fn (): string => Str::uuid());
```

### ID

The `ID` field is typically a handler for the model's primary key. It can be an incremental numeric ID or a UUID as well.

```php
$field = ID::make();
```

### Number

The `Number` field is typically a handler for `numeric` model attributes:

```php
$field = Number::make(__('Age'), 'age');
```

You can also apply modifiers on a text field:

```php
// Adds the "size" HTML input attribute
$field->size(40);

// Adds the "min" HTML input attribute
$field->min(40);

// Adds the "max" HTML input attribute
$field->max(40);

// Adds the "step" HTML input attribute
$field->step(1);
```

### Radio

The `Radio` field is similar to [`Checkbox`](#checkbox), however only single values are allowed, unlike in the case of `Checkbox`, where array of values are being stored:

```php
$field = Radio::make(__('Role'), 'role')
    ->options([
        'admin' => 'Admin',
        'editor' => 'Editor',
        'member' => 'Member',
    ]);
```

You may also pass a `Closure` to customize the resolution logic of the options, see the [`Select`](#select) field.

### Range

The `Range` field is typically a handler for `numeric` model attributes:

```php
$field = Range::make(__('Points'), 'points')
    ->min(0)
    ->max(10);
```

### Repeater

The `Repeater` field similar to the [`Fieldset`](#fieldset) field, however the sub-fields are repeatable:

```php
$field = Repeater::make(__('Books'), 'books')
    ->withFields(static function (): array {
        return [
            Text::make(__('Author'), 'author'),
            Text::make('ISBN'),
        ];
    });
```

You may also set a maximum number of repeatable elements using the `max` method:

```php
$field->max(4);
```

### Select

The `Select` field is similar to the [`Checkbox`](#checkbox), [`Dropdown`](#dropdown) and [`Radio`](#radio) fields, in fact the `Select` field is their parent class:

```php
$field = Select::make(__('Tags'), 'tags')
    ->options([
        'bug' => 'Bug',
        'info' => 'Info',
        'question' => 'Question',
    ]);
```

You may make the field to `nullable` which means an extra empty option is available in the options:

```php
$field->nullable();

// or

$field->nullable(false);
```

You can also apply modifiers on `Select` field:

```php
// Adds the "size" HTML input attribute
$field->size(10);

// Adds the "multiple" HTML input attribute
$field->multiple();
// or
$field->multiple(false);
```

You may also pass a `Closure` to customize the resolution logic of the options:

```php
use App\Category;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

$field = Select::make(__('Category'), 'category')
    ->options(static function (Request $request, Model $model): array {
        return match (true) {
            $request->user()->isAdmin() => Category::query()->pluck('name', 'id')->all(),
            default => $request->user()->categories()->pluck('name', 'id')->all(),
        };
    });
```

### Slug

The `Slug` field  is typically a handler for auto-generating URL friendly values of specified model attributes:

```php
$field = Slug::make(__('Slug'), 'slug')
    ->from(['name']);
```

You may also want to have unique slugs, which means when a slug is already exists in the database table, the new slug will get an incremented numeric suffix to avoid conflicts:

```php
$field->unique();

// unique-slug
// unique-slug-1
// unique-slug-2
// etc...
```

You may also want to customize the slug separator:

```php
$field->separator('_');
```

> The default slug separator is `-`.

You may also want to completely customize the slug generation logic:

```php
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

$field->generateUsing(static function (Request $request, Model $model, string $value): string {
    return sprintf('%s-%s', $value, Str::random(5));
});
```

By default the `Slug` field is generating slug only when creating the model. If you want to run the generation logic when the model is being updated as well, you may call the `always` method:

```php
$field->always();
```

### Text

The `Text` field is typically a handler for `string` model attributes:

```php
$field = Text::make(__('Title'), 'title');
```

You can also apply modifiers on `Text` field:

```php
// Adds the "size" HTML input attribute
$field->size(40);

// Adds the "minlength" HTML input attribute
$field->minlength(40);

// Adds the "maxlength" HTML input attribute
$field->maxlength(40);
```

### Textarea

The `Textarea` field is typically a handler for longer `string` model attributes:

```php
$field = Textarea::make(__('Bio'), 'bio');
```

You can also apply modifiers on a text field:

```php
// Adds the "rows" HTML input attribute
$field->rows(20);

// Adds the "cols" HTML input attribute
$field->cols(100);
```

### URL

The `URL` field is typically a handler for `url` model attributes:

```php
$field = URL::make(__('GitHub Profile'), 'gh_profile');
```

## Relation Fields

Relation fields are representing Eloquent relation definitions on the resource models. Relation fields are highly customizable and provide a nice and detailed API.

### Configuration

#### Searchable & Sortable Columns

When using the `searchable` and `sortable` methods on the relation fields the target columns should be defined.

```php
$field->searchable(columns: [
    'id', 'name',
]);
```

```php
$field->sortable(column: 'name');
```

#### Customizing the Query

You may customize the relatable model's query. This is possible defining global scopes per field type or locally on the field definition.

You may apply global customization using the `scopeQuery` static method:

```php
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

Media::scopeQuery(function (Request $request, Builder $query, Model $model): Builder {
    return $query->where('user_id', $request->user()->getKey());
});
```

> This will apply the query resolution logic to all `Media` fields.

You may apply local customization using the `withRelatableQuery` method:

```php
$field->withRelatableQuery(function (Request $request, Builder $query, Model $model): Builder {
    return $query->where('user_id', $request->user()->getKey());
})
```

#### Formatting

You may format the relatable models. By default the ID is displayed, but you can customize the format easily:

```php
$field->display('name');
```

Alternatively, you may pass a `Closure`:

```php
$field->display(static function (Model $model): string {
    return strtoupper($model->name);
});
```

#### Aggregates

On `index` views, often it makes more sense to display an aggregated value of the relation. For example, when a model has a `BelongsToMany` relation with a bunch of attached record, it's not really optimal to show all the related model's formatted value in the table row, but the number of the attached values.

You may customize this aggregation logic using the `aggregate` function. The first parameter is the aggregate function, while the second one is the aggregated column.

```php
$field->aggregate('count', 'id');

// or

$field->aggregate('sum', 'tax');
```

> The available aggregate functions: `count`, `min`, `max`, `sum` and `avg`.

#### Grouping

You may also group options for a better UI. This feature wraps the `<option>` elements into an `<optgroup>`.

```php
$field->groupOptionsBy('category_id');
```

Alternatively, you may pass a `Closure`:

```php
$field->groupOptionsBy(static function (Model $model): string {
    return $model->category->name;
});
```

#### Subresources

When relation fields need more robust management you might convert it as a subresource. That means, instead of rendering a `<select>` on the resource form, the relation field gets its own CRUD interfaces as it would be a resource.

```php
$field->asSubResource();
```

Subresources appear on the parent resource models's show route.

##### Fields

When using a field as subresource, you may define the related model's fields:

```php
$field->withFields(static function (Request $request): array {
    return [
        Textarea::make('Body'),
        Boolean::make('Approved'),
    ];
});
```

##### Filters

When using a field as subresource, you may define the filters for its `index` view:

```php
use App\Root\Filters\CategoryFilter;

$field->withFilters(static function (Request $request): array {
    return [
        new CategoryFilter,
    ];
});
```

##### Actions

When using a field as subresource, you may define the filters for its `index` view:

```php
use App\Root\Actions\SendOrderNotification;

$field->withActions(static function (Request $request): array {
    return [
        new SendOrderNotification,
    ];
});
```

### BelongsTo

The `BelongsTo` field is typically a handler for an existing `Illuminate\Database\Eloquent\Relations\BelongsTo` relation:

```php
$field = BelongsTo::make(__('Author'), 'author');
```

> The `BelongsTo` field cannot be a subresource.

### BelongsToMany

The `BelongsToMany` field is typically a handler for a `Illuminate\Database\Eloquent\Relations\BelongsToMany` relation:

```php
$field = BelongsToMany::make(__('Teams'), 'teams');
```

When using as subresource, you may define editable pivot fields. Use the `withPivotFields` instead of the `withFields`:

> Only existing models can be attached, creating relatable models from the subresource is not supported.

```php
$field->withPivotFields(static function (Request $request): array {
    return [
        Select::make('Role', 'role')->options([
            'admin' => 'Admin',
            'member' => 'Member',
        ]),
    ];
});
```

Sometimes you may want to attach the same model multiple times (maybe with different pivot values). To do so, call the `allowDuplicateRelations` method on the field:

```php
$field->allowDuplicateRelations();
```

When duplications are allowed, the relatable model query includes the already attached models as well, otherwise they are excluded from the query.

### HasMany

The `HasMany` field is typically a handler for a `Illuminate\Database\Eloquent\Relations\HasMany` relation:

```php
$field = HasMany::make(__('Comments'), 'comments');
```

When using as subresource, you may define the related model's fields:

```php
$field->withFields(static function (Request $request): array {
    return [
        Textarea::make('Body'),
        Boolean::make('Approved'),
    ];
});
```

### HasOne

The `HasOne` field is typically a handler for a `Illuminate\Database\Eloquent\Relations\HasOne` relation:

```php
$field = HasMany::make(__('Comments'), 'comments');
```

### MorphMany

The `MorphMany` field is typically a handler for a `Illuminate\Database\Eloquent\Relations\MorphMany` relation:

### MorphOne

The `MorphOne` field is typically a handler for a `Illuminate\Database\Eloquent\Relations\MorphOne` relation:

### MorphToMany

The `MorphToMany` field is typically a handler for a `Illuminate\Database\Eloquent\Relations\MorphToMany` relation:

### File

### Media

### Meta

## Computed Fields
