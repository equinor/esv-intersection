/**
 * Return a string saying hello to name passed as input parameter.
 * @param name Name to greet
 * @return Greeting message
 *
 * @example
 * hello('npm'); // -> 'Hello npm!'
 */
export function hello(name: string = 'npm'): string {
  return `Hello ${name}!`
}
