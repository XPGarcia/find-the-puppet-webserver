import { environment } from '../configs';

export const MongoUri = `mongodb://${environment.mongoose.user}:${environment.mongoose.password}@${environment.mongoose.host}`;
