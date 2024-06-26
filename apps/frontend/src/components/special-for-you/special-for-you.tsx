import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { getUser } from '../../redux/userSlice/selectors';
import { CalorieCoefficients, Slider } from '../../constants';
import { fetchRecommendedTrainingsAction } from '../../redux/trainingSlice/apiTrainingActions';
import { getRecommendedTrainings } from '../../redux/trainingSlice/selectors';
import { ArrowLeft, ArrowRight } from '../../helper/svg-const';
import SpecialForYouItem from '../special-for-you-item/special-for-you-item';

function SpecialForYou(): JSX.Element {
  const dispatch = useAppDispatch();

  const user = useAppSelector(getUser);
  const userTrainingTypes = user?.typesOfTraining;
  const userDuration = user?.client?.timeOfTraining;
  const userTrainingLevel = user?.level;
  const userDailyCaloriesCount = user?.client?.caloryLosingPlanDaily;
  const specialForYouTrainings = useAppSelector(getRecommendedTrainings);

  let caloriesMin = 1000;
  let caloriesMax = 5000;

  if (userDailyCaloriesCount) {
    caloriesMin =
      userDailyCaloriesCount * CalorieCoefficients.minCaloriesCountCoefficient < 1000 ||
      userDailyCaloriesCount * CalorieCoefficients.minCaloriesCountCoefficient > 5000
        ? 1000
        : +(userDailyCaloriesCount * CalorieCoefficients.minCaloriesCountCoefficient).toFixed(0);

    caloriesMax =
      userDailyCaloriesCount * CalorieCoefficients.maxCaloriesCountCoefficient < 1000 ||
      userDailyCaloriesCount * CalorieCoefficients.maxCaloriesCountCoefficient > 5000
        ? 5000
        : +(userDailyCaloriesCount * CalorieCoefficients.maxCaloriesCountCoefficient).toFixed(0);
  }

  const [trainingsCurrentPage, setTrainingsCurrentPage] = useState(1);

  useEffect(() => {
    if (
      userDuration &&
      userTrainingTypes &&
      userTrainingLevel &&
      userDailyCaloriesCount
    ) {
      dispatch(
        fetchRecommendedTrainingsAction({
          types: userTrainingTypes.join(','),
          durations: userDuration,
          levelOfUser: userTrainingLevel,
          caloriesMin,
          caloriesMax,
          limit: Slider.maxSliderTrainingsCount,
        }),
      );
    }
  }, [
    dispatch,
    userDailyCaloriesCount,
    userDuration,
    userTrainingLevel,
    userTrainingTypes,
    caloriesMax,
    caloriesMin,
  ]);

  const handleBackArrowButtonClick = () => {
    setTrainingsCurrentPage((prevState) =>
      prevState > 1 ? prevState - 1 : prevState,
    );
  };

  const handleNextArrowButtonClick = () => {
    setTrainingsCurrentPage((prevState) =>
      trainingsCurrentPage <
      Slider.maxSliderTrainingsCount / Slider.maxSliderTrainingsPerPage
        ? prevState + 1
        : prevState,
    );
  };

  return (
    <section className="special-for-you" data-testid="special-for-you">
      <div className="container">
        <div className="special-for-you__wrapper">
          <div className="special-for-you__title-wrapper">
            <h2 className="special-for-you__title">
              Специально подобрано для вас
            </h2>
            <div className="special-for-you__controls">
              <button
                onClick={handleBackArrowButtonClick}
                className="btn-icon special-for-you__control"
                type="button"
                aria-label="previous"
              >
                <svg width="16" height="14" aria-hidden="true">
                  <ArrowLeft />
                </svg>
              </button>
              <button
                onClick={handleNextArrowButtonClick}
                className="btn-icon special-for-you__control"
                type="button"
                aria-label="next"
              >
                <svg width="16" height="14" aria-hidden="true">
                  <ArrowRight />
                </svg>
              </button>
            </div>
          </div>
          <ul className="special-for-you__list">
            {specialForYouTrainings
              ?.slice(
                (trainingsCurrentPage - 1) * Slider.maxSliderTrainingsPerPage,
                trainingsCurrentPage * Slider.maxSliderTrainingsPerPage,
              )
              .map((training) => (
                <SpecialForYouItem key={training.id} training={training} />
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default SpecialForYou;
