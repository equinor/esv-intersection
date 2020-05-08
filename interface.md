# Intersection API

![API overview](resources/images/intersection-architecture.png)

The component's top level interface is the Controller, here you can either supply layers and reference systems and such at creation, or at a later time. The only thing that is required upon creation is a html container.

```javascript
import { Controller } from '@equinor/esv-intersection';

const container = document.createElement('div');

new Controller({ container });
```

To get a reference system to work with, you can pass in either your own instantiation or simply supply a set of coordinates. Note however that passing in both will give priority to the reference system that you passed in as a parameter instead of the controller's built-in instance. If you do set either a path or a new reference system, this will override any existing reference system.
