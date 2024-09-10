# Anatomy of a component

A component is made up of three main layers:
- View layer: this layer is made up of markup and styling (tsx and tailwind classes in our project)
- State layer: this layer is responsible maintaining the reactive state of the application and making it accessible to
the view layer
- Logic layer: this layer is responsible for handling all the business logic of the component

How the layer are represented in code:

- `<component-name>.view.tsx` : View layer
- `<component-name>.state.tsx` : State layer ("Headless component")
- `<component-name>.presenter.tsx` : Logic layer
- `<component-name>.controller.tsx` Glue between the View and State layer ("Container component")
