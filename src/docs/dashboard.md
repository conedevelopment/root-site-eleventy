---
title: "Dashboard"
github: "https://github.com/conedevelopment/root-docs/blob/master/dashboard.md"
order: 2
---

## Widgets

> For the detailed documentation visit the [widgets](/docs/widgets) section.

You may register your dashboard widgets by using the `RootServiceProvider` which is published and automatically registered when the `root:install` artisan command is called.

```php
namespace App\Providers;

use App\Root\Widgets\PostCount;
use Cone\Root\RootApplicationServiceProvider;

class RootServiceProvider extends RootApplicationServiceProvider
{
    /**
     * The dashboard widgets.
     */
    protected function widgets(): array
    {
        return [
            new PostCount,
        ];
    }
}
```
