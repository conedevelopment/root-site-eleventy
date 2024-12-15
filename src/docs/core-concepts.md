---
title: "Core Concepts"
github: "https://github.com/conedevelopment/root-docs/blob/master/core-concepts.md"
order: 1
---

## What is Root?

Root is an admin package for Laravel applications. It offers a simple model management with a robust resource API and a modern and fast UI.

Root is a quite simple, drop-in admin package. It means, it requires less configuration when installing, so probably it's easier to migrate between versions, or migrate between projects.

However, it comes with a price: Root is scoped to small, medium-sized projects: e-commerce or generic CMS projects.

Root is targeting smaller applications and offers simpler and faster integration into your running or fresh application.

## Overriding Container Bindings

Root tries to be as flexible as possible. This means it provides an easy way to override default configuration without touching anything else but replacing a container binding.

For example, you might want to use your own product model, which has the `App\Models\Product` namespace. It's not enough to extend the `Cone\Bazar\Models\Product` model because the relations and the contract-based bindings – like route model bindings – still use the original model.

To solve this without adding more complexity than necessary, Bazar uses proxies to resolve the currently bound values of the given contract. It means you can easily swap container bindings without touching anything else in the codebase.

```php
namespace App\Models;

use Cone\Bazar\Models\Product as BaseProduct;

class Product extends BaseProduct
{
    //
}
```

After you created your customizable model, you can swap the container binding for the product contract. You might do that in one of your service provider's `register` method:

```php
use App\Models\Product;
use Cone\Bazar\Contracts\Models\Product as Contract;

public function register(): void
{
    $this->app->bind(Contract::class, Product::class);
}
```

> Note, you should extend the **base model** then bind it to the **interface**.

### Proxies

Proxies are representing the classes that are currently bound to the container. You usually won't use these a lot, but in some cases – like when you develop a package or extension – proxies can be convenient.

```php
use Cone\Bazar\Models\Product;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Available proxy methods
Product::proxy();
Product::getProxiedClass();
Product::getProxiedContract();

// Proxied calls to the bound instance
Product::proxy()->newQuery()->where(...);

// Dynamic usage of bound classes
public function product(): BelongsTo
{
    $this->belongsTo(Product::getProxiedClass());
}
```

Bazar provides the `InteractsWithProxy` trait, that makes the desired class proxyable. The trait comes with an abstract methods to be able to resolve the proxies class from the container automatically:

```php
namespace App\Models;

use App\Contracts\Models\Addon as Contract;
use Cone\Bazar\Concerns\InteractsWithProxy;
use Illuminate\Database\Eloquent\Model;

class Addon extends Model implements Contract
{
    use InteractsWithProxy;

    /**
     * Get the proxied contract.
     */
    public static function getProxiedContract(): string
    {
        return Contract::class;
    }
}
```

Also, we need to bind the contract to the container in a service provider:

```php
public function register(): void
{
    $this->app->bind(\App\Contracts\Models\Addon::class, \App\Models\Addon::class);
}
```

From this point, our `Addon` model is proxyable, which means if we swap the binding in the container, the proxied class will be the currently bound value and not the original one. This adds more flexibility when extending our application or using packages.

```php
// Use the Addon proxy

Addon::proxy()->newQuery();
```
