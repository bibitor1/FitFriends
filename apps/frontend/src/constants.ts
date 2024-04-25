export const BASE_RESPONSE_URL = 'http//localhost:4000/api';
export const FILE_URL = 'http//localhost:4000';
export const SERVER_API_URL = 'http//localhost:4000/api';

export const DAYS_IN_A_WEEK = 7;

export enum AppRoute {
  Root = '/',
  Intro = '/intro',
  Login = '/login',
  Main = '/main',
  TrainerRoom = '/trainer-room',
  ClientRoom = '/client-room',
  Info = '/info',
  Register = '/register',
  RegisterTrainer = '/register-trainer',
  RegisterClient = '/register-client',
  CreateTraining = '/create-training',
  MyTrainings = '/my-trainings',
  MyOrders = '/my-orders',
  FriendsList = '/friends-list',
  TrainingCard = '/training-card',
  TrainingCatalog = '/training-catalog',
  UsersCatalog = '/users-catalog',
  UserCard = '/user-card',
  UserCardId = '/user-card/:id',
  NotFound = '*',
}

export enum NameSpace {
  UserSlice = 'USER_SLICE',
  AppSlice = 'APP_SLICE',
  TrainingSlice = 'TRAINING_SLICE',
}

export enum AuthStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}

export enum APIRoute {
  Register = '/auth/register',
  Login = '/auth/login',
  Check = '/auth/check',
  Logout = '/auth/logout',
  Refresh = '/auth/refresh',
  UpdateUser = '/users/update',
  Users = '/users',
  Notify = '/notify',
  Friends = '/users/friends',
  Avatar = 'files/upload/img',
  Certificate = 'files/upload/pdf',
  DeleteCertificate = 'files/delete/certificate',
  AddFriend = '/users/friends/add',
  RemoveFriend = '/users/friends/remove',
  Trainings = '/trainings',
  RecommendedTrainings = '/trainings/recommended',
  Orders = '/orders/trainings',
}

export enum SliceStatus {
  Idle = 'IDLE',
  Loading = 'LOADING',
  Rejected = 'REJECTED',
  Fulfilled = 'FULFILLED',
}

export const LOCATIONS_ZOD = [
  'Пионерская',
  'Петроградская',
  'Удельная',
  'Звёздная',
  'Спортивная',
] as const;

export const MAX_CERTIFICATES_COUNT_PER_PAGE = 3;

export const CERTIFICATE_FILE_TYPES = ['jpg', 'pdf', 'png'];

export const TYPE_TRAINING_ZOD = [
  'йога',
  'бег',
  'силовые',
  'аэробика',
  'кроссфит',
  'бокс',
  'пилатес',
  'стрейчинг',
] as const;

export const LEVEL_TRAINING_ZOD = [
  'новичок',
  'любитель',
  'профессионал',
] as const;

export const DURATION_TRAINING_ZOD = [
  '10-30 мин',
  '30-50 мин',
  '50-80 мин',
  'больше 80 мин',
] as const;

export const GENDER_ZOD = ['мужской', 'женский', 'неважно'] as const;
export const ROLE_ZOD = ['тренер', 'пользователь'] as const;

export const AVATAR_FILE_TYPES = ['jpg', 'png', 'jpeg'] as const;

export const AVATAR_MAX_SIZE = 1000000;
