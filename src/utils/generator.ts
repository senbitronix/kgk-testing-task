import { Point } from '../models/point';

const MIN_LAT = 53.3478;
const MAX_LAT = 64.5401;
const MIN_LNG = 32.0567;
const MAX_LNG = 129.7285;

function* generatePoints(count: number = 10000): Generator<Point> {
  for (let i = 0; i < count; i++) {
    const id = i + 1;
    const x = MIN_LAT + Math.random() * (MAX_LAT - MIN_LAT); // Случайная широта
    const y = MIN_LNG + Math.random() * (MAX_LNG - MIN_LNG); // Случайная долгота
    const code = Math.floor(Math.random() * 1000000000).toString();
    const address = `ул. 5-я Парковая, ${Math.floor(Math.random() * 100)}`;
    const company = `ОАО "Компания ${id}"`;
    yield new Point(id, x, y, code, address, company);
  }
}

export { generatePoints };
