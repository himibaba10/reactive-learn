import { connect } from 'mongoose';

export const dbConnect = async () => {
  try {
    const conn = await connect(String(process.env.MONGODB_CONNECTION_STRING));
    return conn;
  } catch (error) {
    console.error('Error connecting Database');
    console.error(error);
  }
};
