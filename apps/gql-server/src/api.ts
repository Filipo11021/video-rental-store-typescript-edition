import { createFilmModule } from '@repo/film/module';
import { createRentalModule } from '@repo/rental/module';
import { createAuthModule } from '@repo/auth/module';

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

const authModuleResult = createAuthModule();
if (!authModuleResult.ok) {
  console.error(authModuleResult.error);
  process.exit(1);
}
console.log('Auth module created successfully');

export const filmModule = filmModuleResult.value;
export const rentalModule = rentalModuleResult.value;
export const authModule = authModuleResult.value;
