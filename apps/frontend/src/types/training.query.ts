import { DefaultTraining } from '@fit-friends/types';

export class TrainingQuery {
  public limit?: number = DefaultTraining.Limit;
  public sortDirection?: 'desc' | 'asc';
  public priceSort?: 'asc' | 'desc' = 'desc';
  public ratingSort?: 'asc' | 'desc';
  public quantitySort?: 'asc' | 'desc';
  public page?: number = DefaultTraining.Page;
  public priceMin?: number;
  public priceMax?: number;
  public caloriesMin?: number;
  public caloriesMax?: number;
  public ratingMin?: number;
  public ratingMax?: number;
  public types?: string;
  public trainerId?: number;
  public durations?: string;
  public levelOfUser?: string;
  public isPromo?: boolean;
}
