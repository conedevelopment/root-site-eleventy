---
title: "Bazar"
github: "https://github.com/conedevelopment/root-docs/blob/master/bazar.md"
order: 10
---

## The Scope and Scale

Bazar is made to be compact and easy to integrate. This means our goal is to provide a simple solution for those who want to build a small to medium-sized e-commerce system. Keep it in mind when using Bazar; while it is relatively easy to scale (because of the Laravel foundations), it's not for the next eBay or Amazon.

## Headless

Bazar does not provide a REST API nor a ready-to-use web shop application. It behaves as a framework, and it gives every tool that helps you build your solutions.

If you need a REST API because you want to build a Vue-based store, you can easily do it. If you need a classic webshop application, no worries, you can make it relatively quickly and easily.

We'll provide example code and solutions in the near future, but the Bazar core will never contain more than necessary.

## Drop-in

Bazar is a drop-in solution; this means it behaves as a package and not as an application. It has its own layer, so you can build many different things in the same application next to an installed and running Bazar package.

## Requirements

Before moving on, please check out the Laravel [documentation](https://laravel.com/docs/master/installation) about its installation, requirements, and configuration.

Requirements:
- Laravel `^10.0`
- PHP `8.2+`
- Root `^2.0`

## Installation

You can install Bazar using composer:

```sh
composer require conedevelopment/bazar
```

### Running the Install Command

After installing the package, run the `bazar:install` command.

{% notification %}Please note: if you are using Windows, you might open your terminal or development environment as a system administrator.{% endnotification %}

```sh
php artisan bazar:install
```

### Configuration

After install Bazar, you can find the `config/bazar.php` file, where you can configure the package. We'll talk about the specific configurations in their related documentation sections.

## Payment Gateways

Bazar provides some default drivers out of the box: `Cash` and `Transfer` drivers. They hold an elementary logic and transaction handling; however, they can be enough in many cases.

Also, you may add your custom driver easily that implements the required logic or pull in a package that provides a gateway.

### Checkout
### Capturing Payments
### Handing Payment Notifications
### Handling Refunds

### Stripe Driver

### Creating Custom Drivers

Registering gateways works almost the same as registering shipping methods. All custom drivers should extend the `Bazar\Gateway\Driver` class.

```php
use Cone\Bazar\Gateway\Driver;

class CreditCardDriver extends Driver
{
    //
}
```

Now, let's register the driver using the `Bazar\Support\Facades\Gateway` facade:

```php
use Cone\Bazar\Support\Facades\Gateway;

Gateway::extend('credit-card', static function ($app): CreditCardDriver {
    return new CreditCardDriver(
        $app['config']->get('services.credit-card')
    );
});
```

## Shipping

Shipping drivers are responsible for calculating the cost of a model that implements the `Bazar\Contracts\Shippable` contract.

Bazar provides some default drivers out of the box: `Local Pickup` and `Weight Based Shipping` drivers.

### The Shippable Contract

The class that implements the interface must implement the `shipping` method, where the relationship is defined between the model and the `Bazar\Models\Shipping` model:

{% notification %}By default, the `Bazar\Models\Order` and the `Bazar\Models\Cart` models are implementing the contract.{% endnotification %}

```php
use Cone\Bazar\Models\Shipping;
use Illuminate\Database\Eloquent\Relations\MorphOne;

public function shipping(): MorphOne
{
    return $this->morphOne(Shipping::class, 'shippable')->withDefault();
}
```

### Shipping Address

The `Shipping` model does not hold the address values directly on the model, but in the related `Bazar\Models\Address` model.

### Creating Custom Drivers

Registering shipping methods works almost the same as registering gateways methods. All custom drivers should extend the `Bazar\Shipping\Driver` class, which holds one abstract method: `calculate()`.

Let's create a simple driver as an example:

```php
use Cone\Bazar\Contracts\Shippable;
use Cone\Bazar\Shipping\Driver;

class FedexDriver extends Driver
{
    public function calculate(Shippable $model): float
    {
        //
    }
}
```

Now, let's register the driver using the `Bazar\Support\Facades\Shipping` facade:

```php
use Cone\Bazar\Support\Facades\Shipping;

Shipping::extend('fedex', static function ($app): FedexDriver {
    return new FedexDriver(
        $app['config']->get('services.fedex')
    );
});
```

## Cart

Bazar comes with a cart service by default, which manages cart models and their functionality.y. The cart service is one of the most crucial concepts in Bazar. It handles products, variations, quantities, taxes, discounts, shipping and prepares the checkout process.

You can access the current cart by using the `Bazar\Support\Facades\Cart` facade.

{% notification %}When using the `Cart` facade, keep in mind, the **facade** forwards calls to the `Cart` **model**; this provides a more flexible approach.{% endnotification %}

Bazar provides the [`CookieDriver`](#cookie-driver) by default.

### Items

Products can be attached to the cart by using the `Bazar\Models\Item` pivot model. This model holds all the critical information of the relationship between the cart and the product, such as `price`, `quantity` and custom `properties`.

The same product can be attached to the cart as different items. In fact, if a product will be attached to the cart with `properties` that are already present, the `quantity` will be increased automatically. However, if there is no product linked with the given properties, a new item will be created.

This approach makes it simple to handle quantities, prices, and variations in a cart - even if the same product was attached multiple times but with different `properties`.

```php
$item = Cart::addItem($product, 1, ['Size' => 'L']);

Cart::updateItem($item->id, ['Size' => 'S']);

Cart::removeItem($item->id);
```

### Taxes

### Discounts

### Shipping

### Lock/Unlock Mechanism

Bazar supports multiple currencies by default. Imagine a scenario when your customer starts to put an item in the cart with USD prices, but suddenly, the customer changes the currency. In this case, Bazar recalculates the fees, taxes, discounts and will update the cart's currency.

However, this behavior can be controlled by the lock/unlock mechanism. When the cart is *unlocked*, Bazar will update the items on currency change. But when the cart is *locked*, it will keep the original currency and its values.

{% notification %}Note, you may retrieve the `Cart` model using the `Cart` facade for this feature.{% endnotification %}

```php
use Cone\Bazar\Models\Cart;

$cart = Cart::first();

// Lock the cart
$cart->lock();

// Unlock the cart
$cart->unlock();

// Get locked carts
Cart::query()->locked();

// Get unlocked carts
Cart::query()->unlocked();
```

This can be extremely useful in the checkout process. Locking the cart can make sure that the values are not changing during the process.

### Cart Checkout Flow

### Expiration

To keep the database clean, carts without owners **expire in 3 days**. To retrieve the expired carts, you may use the `expired()` query scope on the `Cart` model:

```php
use Cone\Bazar\Models\Cart;

$expired = Cart::expired()->get();
```

Also, Bazar provides a command to clean all the expired carts easily. You may run the `php artisan bazar:clear-carts` command to delete the database's expired cart records.

{% notification %}In some cases, you may delete all the existing carts. To do so, pass the `--all` flag to the command.{% endnotification %}

You may call this command from the scheduler to automatize the cleanup process:

```php
// app/Console/Kernel.php

protected function schedule(Schedule $schedule)
{
    $schedule->command('bazar:clear-carts')->daily();
}
```

### Cookie Driver

Bazar comes with a cookie driver by default. It stores the current cart's token as a cookie and retrieves the cart model based on the stored token. Because of its straightforward implementation, the cookie driver is not configurable.

### Creating Custom Drivers

Like shipping and payment gateway, Bazar manages multiple cart drivers as well. You can set the default driver easily in the configuration file:

```php
// config/bazar.php

'cart' => [
    'default' => 'token',
    'drivers' => [
        'cookie' => [],
        'token' => [
            // ...
        ],
    ],
]
```

Registering cart drivers works almost the same as registering shipping methods or payment gateways. All custom drivers should extend the `Bazar\Cart\Driver` class, which holds one abstract method: `resolve()`.

```php
use Cone\Bazar\Cart\Driver;
use Cone\Bazar\Models\Cart;

class TokenDriver extends Driver
{
    protected function resolve(Request $request): Cart
    {
        return Cart::query()->firstOrNew([
            //
        ]);
    }

    protected function resolved(Request $request, Cart $cart): void
    {
        parent::resolved($request, $cart);

        // Callback after the cart is resolved
    }
}
```

Now, let's register the driver using the `Bazar\Support\Facades\Cart` facade:

```php
use Cone\Bazar\Support\Facades\Cart;

Cart::extend('custom', function ($app): CustomDriver {
    return new CustomDriver(
        $app['config']->get('cart.drivers.custom')
    );
});
```

## Taxes

Bazar comes with flexible tax support by default. You can easily manage tax definitions by using the `Bazar\Support\Facades\Tax` facade.

Taxes are stored on the `Item` and the `Shipping` models. Both implement the `Taxable` interface, which enforces to use of a unified method signature for calculating taxes.

### Registering Taxes

You may register taxes using the `Tax` facade. You can pass a number, a `Closure`, or a class (that implements the `Bazar\Contracts\Tax` interface) along with the name of the tax.

```php
use Cone\Bazar\Support\Facades\Tax;

// Fix tax
Tax::register('fix-20', 20);
```

```php
// Custom closure tax
use Cone\Bazar\Models\Shipping;
use Cone\Bazar\Contracts\LineItem;
use Cone\Bazar\Support\Facades\Tax;

Tax::register('custom-percent', function (LineItem $model) {
    return $model->getPrice() * ($model instanceof Shipping ? 0.3 : 0.27);
});
```

```php
// Class tax
use Cone\Bazar\Contracts\Tax as Contract;
use Cone\Bazar\Contracts\LineItem;
use Cone\Bazar\Models\Shipping;
use Cone\Bazar\Support\Facades\Tax;

class CustomTax implements Contract
{
    public function calculate(LineItem $model): float
    {
        return $model->getPrice() * ($model instanceof Shipping ? 0.3 : 0.27);
    }
}

Tax::register('complex-tax', CustomTax::class);
// or
Tax::register('complex-tax', new CustomTax);
```

### Removing Taxes

You may remove registered taxes using the `Tax` facade.

```php
use Cone\Bazar\Support\Facades\Tax;

Tax::remove('complex-tax');
```

### Disabling Taxes

You may disable tax calculation globally in some scenarios. To do so, call the `disable` method on the `Tax` facade.

```php
use Cone\Bazar\Support\Facades\Tax;

Tax::disable();
```

{% notification %}Note, when disabling taxes, the previously set taxes won't be updated or recalculated. They stay untouched.{% endnotification %}

## Discounts

Bazar comes with flexible discount support by default. You can easily manage discount definitions by using the `Bazar\Support\Facades\Discount` facade.

Discounts are stored on the `Item` and the `Shipping` models. Both implement the `Discountable` interface, which enforces to use of a unified method signature for calculating discounts.

### Registering Discounts

You may register discounts using the `Discount` facade. You can pass a number, a `Closure`, or a class (that implements the `Bazar\Contracts\Discount` interface) along with the name of the discount.

```php
use Cone\Bazar\Support\Facades\Discount;

// Fix discount
Discount::register('fix-20', 20);
```

```php
// Custom closure discount
use Cone\Bazar\Support\Facades\Discount;

Discount::register('custom-percent', function (Discountable $model) {
    return $model->getTotal() * 0.3;
});
```

```php
// Class discount
use Cone\Bazar\Contracts\Discount as Contract;
use Cone\Bazar\Contracts\Discountable;
use Cone\Bazar\Support\Facades\Discount;

class CustomDiscount implements Contract
{
    public function calculate(Discountable $model): float
    {
        return $model->getTotal() * 0.3;
    }
}

Discount::register('complex-discount', CustomDiscount::class);
// or
Discount::register('complex-discount', new CustomDiscount);
```

### Removing Discounts

You may remove registered discounts using the `Discount` facade.

```php
use Cone\Bazar\Support\Facades\Discount;

Discount::remove('complex-discount');
```

### Disabling Discounts

You may disable discount calculation globally in some scenarios. To do so, call the `disable` method on the `Discount` facade.

```php
use Cone\Bazar\Support\Facades\Discount;

Discount::disable();
```

{% notification %}Note, when disabling discounts, the previously set discounts won't be updated or recalculated. They stay untouched.{% endnotification %}
