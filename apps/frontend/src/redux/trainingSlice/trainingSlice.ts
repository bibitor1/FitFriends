import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../../constants';
import { FeedbackRdo } from '../../types/feedback.rdo';
import { TrainingRdo } from '../../types/training.rdo';
import { UserRdo } from '../../types/user.rdo';
import { OrderRdo } from '../../types/order.rdo';
import {
  fetchRecommendedTrainingsAction,
  fetchTrainingsAction,
  fetchTrainingsCatalogAction,
  fetchUserInfoAction,
  fetchFeedbacksAction,
  fetchTrainingAction,
} from './apiTrainingActions';

type TrainingData = {
  training: TrainingRdo | null;
  trainings: TrainingRdo[];
  orders: OrderRdo[];
  allTrainings: TrainingRdo[];
  filteredTrainingCatalog: TrainingRdo[];
  trainingsCatalog: TrainingRdo[];
  recommendedTrainings: TrainingRdo[];
  userTrainings: TrainingRdo[];
  userInfo: UserRdo | null;
  feedbacks: FeedbackRdo[];
};

const initialState: TrainingData = {
  training: null,
  trainings: [],
  orders: [],
  allTrainings: [],
  filteredTrainingCatalog: [],
  trainingsCatalog: [],
  recommendedTrainings: [],
  userTrainings: [],
  userInfo: null,
  feedbacks: [],
};

export const trainingSlice = createSlice({
  name: NameSpace.TrainingSlice,
  initialState,
  reducers: {
    setTraining: (state, action) => {
      state.training = action.payload as TrainingRdo;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTrainingAction.fulfilled, (state, action) => {
        state.training = action.payload;
      })
      .addCase(fetchTrainingAction.rejected, (state) => {
        state.training = null;
      })
      .addCase(fetchTrainingsAction.fulfilled, (state, action) => {
        state.trainings = action.payload;
      })
      .addCase(fetchTrainingsAction.rejected, (state) => {
        state.trainings = [];
      })
      .addCase(fetchTrainingsCatalogAction.fulfilled, (state, action) => {
        state.trainingsCatalog = action.payload;
      })
      .addCase(fetchTrainingsCatalogAction.rejected, (state) => {
        state.trainingsCatalog = [];
      })
      .addCase(fetchRecommendedTrainingsAction.fulfilled, (state, action) => {
        state.recommendedTrainings = action.payload;
      })
      .addCase(fetchRecommendedTrainingsAction.rejected, (state) => {
        state.recommendedTrainings = [];
      })
      .addCase(fetchUserInfoAction.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      })
      .addCase(fetchUserInfoAction.rejected, (state) => {
        state.userInfo = null;
      })
      .addCase(fetchFeedbacksAction.fulfilled, (state, action) => {
        state.feedbacks = action.payload;
      })
      .addCase(fetchFeedbacksAction.rejected, (state) => {
        state.feedbacks = [];
      });
  },
});

export const { setTraining } = trainingSlice.actions;
