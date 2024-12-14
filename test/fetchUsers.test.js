import { expect } from 'chai';
import sinon from 'sinon';
import { fetchUsers } from '../src/users.js';
// Группировка по тестам
describe('Проверка функции: fetchUsers', () => {

    let sandBox;
    // Создание песочницы перед каждым тестированием
    beforeEach(() => {
        sandBox = sinon.createSandbox();
    });

    afterEach(() => { /* Сброс песочницы после завершения теста */
        sandBox.restore();
    });

    it('Должна получать и выводить имена пользователей', async () => {
        const testUsers = [
            { id: 1, name: 'John Doe' },
            { id: 2, name: 'Jane Doe' }
        ];

        global.fetch = sandBox.stub().resolves({ /* Зоздание заглушки для изменения работы fetch */
            ok: true,
            json: async () => testUsers
        });

        const consoleLogSpy = sandBox.spy(console, 'log');

        await fetchUsers();
        expect(global.fetch.calledOnce).to.be.true;
        expect(global.fetch.calledWith("https://jsonplaceholder.typicode.com/users"))

        expect(consoleLogSpy.calledWith('John Doe')).to.be.true;
        expect(consoleLogSpy.calledWith('Jane Doe')).to.be.true;
    });

    it("Должна обрабатывать ошибки при неудачном запросе", async () => {

        global.fetch = sandBox.stub().resolves({ /* Зоздание заглушки для изменения работы fetch */
            ok: false,
            status: 404
        });

        try {
            await fetchUsers();
            expect.fail("Функция должна была выбросить ошибку")
        } catch (error) {
            expect(error.message).to.include("HTTP error! status: 404")
        }
    })
});
