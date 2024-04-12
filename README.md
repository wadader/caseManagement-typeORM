# Nest JS

## ORMS

- I currently have one service (CasesService) representing the data-layer, setup with type-orm.
  - I can rename this service and add another service built with another ORM (drizzle) to easily swap out without affecting the controllers or the dtos

### Type ORM

#### Initial Impressions

##### Pros:

1. Official Support

   - The [official nestJS docs use TypeORM](https://docs.nestjs.com/techniques/database#typeorm-integration) and the [associated repo](https://github.com/nestjs/typeorm) is by the nestJS org

2. Similar Syntax to NestJS
   - TypeORM uses decorators and classes, which is remarkably similar to the NestJS way of doing things.

#### Cons:

1. Unreliable Type Safety

   - While inserting an entity into the database, I found no compile-time errors even though I had missed a required field. That is a very undesirable characteristic for a type-safe ORM to have.

2. Un-Sql like syntax

   - While it does have a query builder, [the default syntax](https://typeorm.io/#creating-and-inserting-a-photo-into-the-database) seems pretty abstracted from SQL. For instance, while using the 'save' function, I was unable to insert relation-ids directly even if I knew them, and instead had to fetch the entity by id first instead

While not a major deal, I felt like the docs were hard to navigate for type ORM

## NestJS

1. Validation with Dtos is pretty nice.

   - Define the dtos once, enable pipeValidation and instantly get informative 400 errors

2. For me
