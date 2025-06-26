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

const filmModule = filmModuleResult.value;
const rentalModule = rentalModuleResult.value;
const authModule = authModuleResult.value;

const registerResult = await authModule.api.register('Filip', 'password');
if (!registerResult.ok) {
  console.error(registerResult.error);
  process.exit(1);
}
console.log('User registered successfully');

const loginResult = await authModule.api.login('Filip', 'password');
if (!loginResult.ok) {
  console.error(loginResult.error);
  process.exit(1);
}
const { accessToken } = loginResult.value;
const authorizeResult = await authModule.api.authorize(accessToken);
if (!authorizeResult.ok) {
  console.error(authorizeResult.error);
  process.exit(1);
}

const filmResult = await filmModule.api.createFilm(
  {
    title: 'The Matrix',
    type: 'regular',
  },
  authorizeResult.value,
);

if (!filmResult.ok) {
  console.error(filmResult.error);
  process.exit(1);
}

console.log(`Film with id ${filmResult.value.id} created successfully`);

const rentalResult = await rentalModule.api.rent(
  {
    filmId: filmResult.value.id,
  },
  authorizeResult.value,
);

if (!rentalResult.ok) {
  console.error(rentalResult.error);
  process.exit(1);
}

console.log(`Film with id ${filmResult.value.id} rented successfully, rental id: ${rentalResult.value.id}`);

const returnResult = await rentalModule.api.return(
  {
    rentalId: rentalResult.value.id,
  },
  authorizeResult.value,
);

if (!returnResult.ok) {
  console.error(returnResult.error);
  process.exit(1);
}

console.log(`Film with id ${filmResult.value.id} returned successfully, rental id: ${returnResult.value.rentalId}`);
