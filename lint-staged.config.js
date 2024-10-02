const config = {
  '*.{ts,tsx}': [() => 'npm run check', 'npm run lint', 'npm run prettify'],
}

export default config
