import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  LEVEL_TRAINING_ZOD,
  TYPE_TRAINING_ZOD,
  CERTIFICATE_FILE_TYPES,
} from '../../const';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowCheck, IconImport } from '../../helper/svg-const';
import BackgroundLogo from '../background-logo/background-logo';
import { upFirstWord } from '../../helper/utils';
import { ChangeEvent, useState } from 'react';
import {
  MAXIMUM_TRAINING_TYPES_CHOICE,
  TrainerMeritLength,
} from '@fit-friends/types';
import { useAppDispatch } from '../../redux/store';
import { updateUserAction } from '../../redux/userSlice/apiUserActions';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../../const';

const formSchema = z.object({
  typesOfTraining: z
    .array(z.enum(TYPE_TRAINING_ZOD))
    .min(1, 'Должен быть выбран хотя бы один тип тренировок')
    .max(MAXIMUM_TRAINING_TYPES_CHOICE, 'Не более трех типов тренировок'),
  level: z.enum(LEVEL_TRAINING_ZOD),
  merits: z
    .string()
    .min(
      TrainerMeritLength.Min,
      `Минимальное значение ${TrainerMeritLength.Min}`,
    )
    .max(
      TrainerMeritLength.Max,
      `Максимальное значение ${TrainerMeritLength.Max}`,
    ),
  isPersonalTraining: z.boolean(),
});

type FormSchema = z.infer<typeof formSchema>;

function FormRegisgerTrainer() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<FormSchema>({ resolver: zodResolver(formSchema) });

  const [certificate, setCertificate] = useState<File | null>(null);
  const [imageInputUsed, setImageInputUsed] = useState(false);
  const [certificateError, setCertificateError] = useState(
    'Добавьте подтверждающий документ',
  );
  const [certificateName, setCertificateName] = useState([
    'Загрузите сюда файлы формата PDF, JPG или PNG',
  ]);

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    setImageInputUsed(true);
    const updateData = {
      level: data.level,
      typesOfTraining: data.typesOfTraining,
      trainer: {
        merits: data.merits,
        isPersonalTraining: data.isPersonalTraining,
        certificate: certificateName,
      },
    };
    dispatch(updateUserAction(updateData));
    reset();
    navigate(AppRoute.TrainerRoom);
  };

  const handleCertificateFileInputChange = (
    evt: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = evt.currentTarget.files && evt.currentTarget.files[0];
    const fileName = file ? file.name.toLowerCase() : '';
    const matches = CERTIFICATE_FILE_TYPES.some((fileType) =>
      fileName.endsWith(fileType),
    );
    setCertificateName([fileName]);

    if (matches && file) {
      setCertificate(file);

      setCertificateError('');
    } else if (!matches && file) {
      setCertificateError('Загрузите сюда файлы формата PDF, JPG или PNG');
    } else {
      setCertificateError('Добавьте подтверждающий документ');
    }
  };

  return (
    <>
      <BackgroundLogo />
      <div className="popup-form popup-form--questionnaire-coach">
        <div className="popup-form__wrapper">
          <div className="popup-form__content">
            <div className="popup-form__form">
              <form method="post" onSubmit={handleSubmit(onSubmit)}>
                <div className="questionnaire-coach">
                  <h1 className="visually-hidden">Опросник</h1>
                  <div className="questionnaire-coach__wrapper">
                    <div className="questionnaire-coach__block">
                      <span className="questionnaire-coach__legend">
                        Ваша специализация (тип) тренировок
                      </span>
                      <div className="specialization-checkbox questionnaire-coach__specializations">
                        {TYPE_TRAINING_ZOD.map((type) => (
                          <div key={type} className="btn-checkbox">
                            <label>
                              <input
                                {...register('typesOfTraining')}
                                className="visually-hidden"
                                type="checkbox"
                                name="typesOfTraining"
                                value={type}
                                aria-invalid={
                                  errors.typesOfTraining ? 'true' : 'false'
                                }
                              />
                              <span className="btn-checkbox__btn">
                                {upFirstWord(type)}
                              </span>
                            </label>
                          </div>
                        ))}
                        {errors.typesOfTraining && (
                          <span role="alert" className="error">
                            {errors.typesOfTraining?.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="questionnaire-coach__block">
                      <span className="questionnaire-coach__legend">
                        Ваш уровень
                      </span>
                      <div className="custom-toggle-radio custom-toggle-radio--big questionnaire-coach__radio">
                        {LEVEL_TRAINING_ZOD.map((level) => (
                          <div
                            key={level}
                            className="custom-toggle-radio__block"
                          >
                            <label>
                              <input
                                {...register('level')}
                                disabled={isSubmitting}
                                type="radio"
                                name="level"
                                value={level}
                              />
                              <span className="custom-toggle-radio__icon"></span>
                              <span className="custom-toggle-radio__label">
                                {upFirstWord(level)}
                              </span>
                            </label>
                          </div>
                        ))}
                        {errors.level && (
                          <span role="alert" className="error">
                            {errors.level?.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="questionnaire-coach__block">
                      <span className="questionnaire-coach__legend">
                        Ваши дипломы и сертификаты
                      </span>
                      <div className="drag-and-drop questionnaire-coach__drag-and-drop">
                        <label
                          className={`${
                            imageInputUsed && certificateError
                              ? 'custom-input--error'
                              : ''
                          }`}
                        >
                          <span className="drag-and-drop__label" tabIndex={0}>
                            {certificateName}
                            <svg width="20" height="20" aria-hidden="true">
                              <IconImport />
                            </svg>
                          </span>
                          <input
                            onChange={handleCertificateFileInputChange}
                            type="file"
                            name="import"
                            tabIndex={-1}
                            accept=".pdf, .jpg, .png"
                            disabled={isSubmitting}
                            multiple
                          />
                          <span className="custom-input__error">
                            {certificateError}
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="questionnaire-coach__block">
                      <span className="questionnaire-coach__legend">
                        Расскажите о своём опыте, который мы сможем проверить
                      </span>
                      <div className="custom-textarea questionnaire-coach__textarea">
                        <label>
                          <textarea
                            {...register('merits')}
                            disabled={isSubmitting}
                            aria-invalid={errors.merits ? 'true' : 'false'}
                            name="merits"
                            placeholder=" "
                          ></textarea>
                        </label>
                        {errors.merits && (
                          <span role="alert" className="error"></span>
                        )}
                      </div>
                      <div className="questionnaire-coach__checkbox">
                        <label>
                          <input
                            {...register('isPersonalTraining')}
                            type="checkbox"
                            name="isPersonalTraining"
                            disabled={isSubmitting}
                            aria-invalid={
                              errors.isPersonalTraining ? 'true' : 'false'
                            }
                          />
                          <span className="questionnaire-coach__checkbox-icon">
                            <svg width="9" height="6" aria-hidden="true">
                              <ArrowCheck />
                            </svg>
                          </span>
                          <span className="questionnaire-coach__checkbox-label">
                            Хочу дополнительно индивидуально тренировать
                          </span>
                        </label>
                        {errors.isPersonalTraining && (
                          <span role="alert" className="error">
                            {errors.isPersonalTraining?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <pre>{JSON.stringify(watch(), null, 2)}</pre>
                  <button
                    className="btn questionnaire-coach__button"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Продолжить
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FormRegisgerTrainer;
