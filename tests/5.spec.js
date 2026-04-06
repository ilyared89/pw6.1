import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

import { MainPage } from '../src/pages/main.page';
import { RegisterPage } from '../src/pages/register.page';
import { YourfeedPage } from '../src/pages/yourfeed.page';

const user = {
	email: faker.internet.email(),
	password: faker.internet.password(),
	username: faker.person.fullName({ lastName: 'Bin' }),
};
/*
Чеклист здоровой архитектуры
Page Object знает как найти, но не что проверить
Тест знает что должно быть, но не как это найти
Локаторы не «утекают» в тесты без необходимости (возвращайте примитивы или фасадные методы)
Ассерты живут в тестах

*/
test('Пользователь может зарегистрироваться используя email и пароль page object', async ({
	page,
}) => {
	const main = new MainPage(page);
	const register = new RegisterPage(page);
	const yourfeed = new YourfeedPage(page);

	await main.open();
	await main.gotoRegister();
	await register.signup(user);
	// ========== ВАРИАНТ 1: Прямой доступ к locator ==========
	// ⚠️ ИСПОЛЬЗУЕМ ПОКА ТОЛЬКО ДЛЯ ТРЕНИРОВКИ - чтобы понять как работает auto-waiting
	// ❌ НАРУШАЕТ ИНКАПСУЛЯЦИЮ - тест напрямую обращается к внутреннему свойству profileName
	// ✅ Имеет auto-waiting (Playwright автоматически ждет элемент и текст)
	// ✅ Работает, но не рекомендуется в Page Object паттерне
	// Как работает:
	// 1. yourfeed.profileName- это page.getByRole('navigation') из конструктора
	// 2. expect() с locator автоматически ждет, пока элемент станет видимым и стабильным
	// 3. toContainText() проверяет, что текст элемента содержит user.name
	await expect(yourfeed.profileName).toContainText(user.username);

	// ========== ВАРИАНТ 2: Через метод getProfileName ==========
	// ✅ СОБЛЮДАЕТ ИНКАПСУЛЯЦИЮ - тест использует публичный метод, не знает о селекторе
	// ✅ Имеет auto-waiting (Playwright автоматически ждет элемент и текст)
	// ✅ Рекомендуемый подход в Page Object паттерне
	// Как работает:
	// 1. getProfileNameLocator() возвращает this.profileName (инкапсулирует селектор)
	// 2. expect() с locator автоматически ждет, пока элемент станет видимым и стабильным
	// 3. toContainText() проверяет, что текст элемента содержит user.name
	// Преимущества:
	// - Если селектор изменится, нужно править только в одном месте (в Page Object)
	// - Тест не зависит от внутренней реализации (селектор скрыт)

	await expect(yourfeed.getProfileName()).toContainText(user.username);
});
