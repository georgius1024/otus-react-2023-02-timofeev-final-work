# Chiroyli LMS - в помощь узучающим узбекский язык
Проект Юрия Тимофеева

## Для чего проект
Узбекского языка нет ни в Дуолингво ни в прочих приложениях. 
Есть в виде приложений для заучивания слов, но там нет правил языка, а словари подобраны довольно хаотично.
Бумажные учебники доступны, но там нет интервального повторения, так необходимого для заучивания слов.
Если речь про простое приложение, где изучение правил сочетается с заучиванием слов, то в части узбекского языка такого не существует в настоящее время.

## Что в проекте

### Планирование
Структура приложения разрабатывалась при помощи Balsamiq Mockups. Прототип приложения доступен здесь: https://drive.google.com/file/d/1ynPvjmTnBx5g4c0Ig5_9IxvH_nv10o8s/view?usp=sharing
### Разработка контента
Для создания учебного контента - создан блок "модули".
Таксономия данных простая: Курс / Занятие / Учебная активность. Реализованы учебнае активности трех видов: слайд, изучение слова и изучение фразы. При необходимости могут быть созданы и другие виды активностей. Если трех уровней не будет достаточно, то новые уровни легко могут быть добавлены, так как весь учебный контент хранится в одной таблице в виде древовидной структуры.

### Обучение
Для изучения языка создан блок обучения. Там учащийся выбирает курс и происходит обучение. Для повтора слов есть отдельный подблок. Учебная активность регистрируется, пройденые курсы доступны для повторения. При изучении курса, на каждом занятии выполняются предусмотренные автором учебные активности.
#### Слайд
Слайд просто показывется учащемуся, никакого взаимодействия не предусмотрено
#### Запоминание слов и фраз
Для лучшего запоминания изучается в несколько этапов:
-1 сначала показывается слово и перевод
-2 учащемуся показывается слово и просьба выбирать из списка правильный перевод слова
-3 показывается перевод и предлагается выбрать правильное слово
-4 мини-пазл: показыватся перевод и предлагается собрать слово из букв или фразу из слов.
#### Повторение
Слова и фразы первоначально изучаются на курсах. Для полного запоминания изучение повторяется несколько раз. При повторении выполняются все те же задания, что и при первоначальном изучении. Повторы происходят на 1, 3, 7, 21 и 50 дни от изучения. Если учащийся совершает ошибку при выполнении задания, то счетчик повторов сбрасыввется и повторение начинается снова. 

## Управление
В настоящее время управление только намечено. Предусматривается управление списком пользователей и учебной активностью каждого студента.

## Технические характеристики и решения

### Инструменты
Проект построен на базе Google Firebase. Использованы модули Firestore, Authentication и Hosting.
Для ускорения разработки был выбран CSS-фреймворк Bootstrap c минимальной кастомизацией. 

### Аутентификация
Реализована на основе Firestore Authentication. Подключена самая простая аутентификация по паролю и email. В будущем возможно подключение других спопобов аутентификации. Реализованы регистрация новых пользователей и напоминание паролей. Роль администратора назначается вручную, в базе данных.

### Данные
Данные приложения хранятся в нереляцилнной СУБД Firestore. Все обращения к бэкенду сведены в сервисы.
Глобальный стор реализован с помощью Redux-toolkit и используется для хранения даных аутентификации, состояния "занят" и всплывающих сообщений.
В приложении имеется множество сложных взаимодействий и информация о текущем шаге часто хранится в прямо url.
Для сглаживания процедуры обучения использован Outlet Context, где хранится вся информация о текущем занятии и его этапах, переключение между шагами производится навигацией. Дочерние компоненты, отвечающие за активности и взаимодействия работают без обращения к базе, с данными из контекста.

### Деплой
Приложение размещено на хостинге Firebase и доступно по адресу https://react-firebase-project-3e66e.web.app
Обновление приложения на хостинге происходит автоматически при push в ветку master.
Для деплоя использованы Github Actions и Firebase deploy.

### Обработка ошибок
Используются "react-error-boundary", глобальный обработчик ошибок и обработчик необработанных исключений.
При ошибке приложение прерывается модальной панелью, пользователю предлагается перезапустить приложение, перейдя на главную страницу. Обработка ошибок в компонентах практически отсутствует и сводится преимущественно к выбрасыванию исключений. В дальнейшем возможно подключение сервиса отслеживания ошибок типа Sentry, Bugsnag и т.п.

### Тестирование
Ввиду относительноо большого размера приложения и ограниченных ресуров, unit-тестирование нашло ограниченное применение при разработке. Тем не меннее инструмент, позволяющий сохранять уверенность в коде необходим и им стало e2e тестирвание, для которого применен Microsoft Playwright. e2e тестирование производится в предсказуемой среде, на специально очищаемой тестовой базе. В ходе тестирования выполняются следующие рутинные задачи:
- заполнение профиля
- создание курса из одного занятия. 
- в занятии создаются учебные активности всех имеющихся типов: слайд, слово, фраза
- выполняется прохождение созданного курса в учебном режиме с выполнением всех доступных заданий
- добавление кастомных слов для повторения
- повторение слов
Это сложно достоверно измерить, но разработчик оценивает покрытие тестами, как крайне высокое. 

### Storybook
Для демонстрации компонентов добавлен Storybook.

### Интернационализация
Приложение работает на руском и английском языках. Использовалась популярная библиотека react-i18next.

### Custom hooks
Повторяющийся код вынесен в кастомные зуки. 
- useBusy - позволяет включить / выключить занятое состояние приложения
- useAlert - добавляет всплывающие сообщения
- useUID - подключается к Store и доставляет в компонент UID пользователя, где необходим
- useErrorHandler - позволяет отправить возникшую ошибку в ближайший error boundary

## Планы развития
Разработчик не обладает необходимыми компетенциями для создания качественного учебного контента. Предполагается коллаборация с местными языковыми школами.
