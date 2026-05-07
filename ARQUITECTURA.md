# GAP

## Arquitectura
La arquitectura que en el cual voy a estar usando para la aplicacion web seria la de cliente servidor, elegi esa arquitectura para implementarla en la aplicacion web por las razones de que me permite aislar la interfaz de usuario de la lógica de negocio y el acceso a la base de datos, tambien es mas facil de estarle haciendo el mantenimiento a la base de datos sin estarle afectando directamente al frontend y se le estaria facilitando la futura implementación de las nuevas funciones que se va a estar agregando enn la aplicacion como el seguimiento de envíos o nuevos métodos de pago.

---

## Modelado
El modelado que voy a estar usando en la aplicacion web seria que va a tener el modelado de las gestiones que en el cual va aser el inicio de sesion y creacion de la cuenta, va a estar el modelado del inventario que su funcion seria que se podria estar mirando que producos estan disponibles en la bodega y la cantidad que queda en cada un de los productos que quedan en el inventario, que productos estan disponibles, qe productos estan agotados y se tendria el precio de cada producto que se vende en la empresa y tendria la modulacion de las transacciones en el cual su funcion seria que se pueda cumplir correctamente el tipo de transaccion que haya elegido el cliente al comprar el producto.

---

## Diagramado
<img width="797" height="530" alt="imagen" src="https://github.com/user-attachments/assets/50a0eb20-78df-4c8f-8a36-a8a4bb11b1c6" />


---

## Logica que contendra
La logica que se va a estar usando es que el cliente pueda acceder a la aplicacion web y que pueda estar mirando los productos que esta ofreciendo la empresa en la aplicacion web con su respectivo precio, si el usuario quiere agregar al carrito un producto que necesita comprar, el cliente tendria que iniciar sesion o crear una cuenta si no tiene una cuenta en la aplicacion web y la informacion de la cuenta se guardara en la base de datos, cuando el usuario agregue el producto que va a comprar en el carrito pueda elegir la cantidad de ese mismo producto dependiendo la cantidad que haya de ese prodcuto que este guardado en la base de datosy que el cliente tambien pueda agregar al carrito varios productos, cuando el usuario va a comprar el producto que selecciono se le mostrara todos los medios de pago que muestra la aplicacion web y cuando el usuario hace la compra se va a actualizar en la base de datos la cantidad del producto que haya comprado el cliente.

