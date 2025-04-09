import { User } from './definitions';

export default function convertStringToObjectArray(
  inputString: string
): User[] | null {
  try {
    // 1. Remove the surrounding brackets
    const cleanedString = inputString.slice(1, -1);

    // 2. Split the string into individual user objects (based on '}, {')
    const userStrings = cleanedString.split('}, {');

    // 3. Parse each user string into a object
    const users = userStrings.map((userString) => {
      // Remove leading and trailing spaces
      const trimmedUserString = userString.trim();

      // Remove any braces around the object
      const trimmedUserObject = trimmedUserString.replace(
        /^[{},]+|[{},]+$/g,
        ''
      );

      // Split the object into key-value pairs, allow whitespace before and after the `=` sign
      const keyValuePairs = trimmedUserObject
        .split(',')
        .map((pair) => pair.trim());

      // Create a user object
      const user: any = {};

      // Convert key-value pairs into an object
      keyValuePairs.forEach((pair) => {
        // Split the pair into key and value using '=' and trim whitespace
        const [key, value] = pair.split('=').map((part) => part.trim());

        //Remove quotes if the value is a string
        const trimmedValue = value?.trim().replace(/^"|"$/g, '');

        // Handle null values
        user[key] = trimmedValue === 'null' ? null : trimmedValue;

        if (key === 'id') user[key] = Number(user[key]);
      });

      return user as User;
    });

    return users;
  } catch (error) {
    console.error('Error parsing user string:', error);
    return []; // Or handle the error as needed
  }
}
