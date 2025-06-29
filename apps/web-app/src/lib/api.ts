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

export const filmApi = filmModuleResult.value.api;
export const rentalApi = rentalModuleResult.value.api;
