export function toBase64(file): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    // @ts-ignore
    reader.onerror = error => resolve({ error });
  });
}
