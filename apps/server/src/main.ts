import { createFilmModule } from '@repo/film/module';
import { createRentalModule } from '@repo/rental/module';

const filmModuleResult = await createFilmModule();
if (!filmModuleResult.ok) {
  console.error(filmModuleResult.error);
  process.exit(1);
}
console.log('Film module created successfully');

const rentalModuleResult = await createRentalModule({
  filmApi: filmModuleResult.value.api,
});
if (!rentalModuleResult.ok) {
  console.error(rentalModuleResult.error);
  process.exit(1);
}
console.log('Rental module created successfully');

const filmModule = filmModuleResult.value;
const rentalModule = rentalModuleResult.value;

const filmResult = await filmModule.api.createFilm({
  title: 'The Matrix',
  type: 'regular',
});

if (!filmResult.ok) {
  console.error(filmResult.error);
  process.exit(1);
}

console.log(`Film with id ${filmResult.value.id} created successfully`);

const rentalResult = await rentalModule.api.rent({
  filmId: filmResult.value.id,
  customerId: '1',
});

if (!rentalResult.ok) {
  console.error(rentalResult.error);
  process.exit(1);
}

console.log(`Film with id ${filmResult.value.id} rented successfully, rental id: ${rentalResult.value.id}`);

const returnResult = await rentalModule.api.return({
  rentalId: rentalResult.value.id,
});

if (!returnResult.ok) {
  console.error(returnResult.error);
  process.exit(1);
}

console.log(`Film with id ${filmResult.value.id} returned successfully, rental id: ${returnResult.value.rentalId}`);
