import { test } from '../src/helpers/fixtures/fixture';
import { expect } from '@playwright/test';
import { Api } from '../src/services/api.service';

const urlApi = 'https://apichallenges.eviltester.com';
test('Получить токен доступа facade', async ({
	request
}) => {
    
    const api = new Api(request);
    const token = await api.challenger.post();
    let response = await api.challenges.get(token);

     expect(response.challenges.length).toEqual(59);
/*
     response = await request.post(`${urlApi}/todos`, {
        headers: {
            'X-CHALLENGER': token
        },
        // унести в билдер
        data: {
            'title': 'title',
            'doneStatus': false,
            'description': 'description'
        }
     });
     r = await response.json(); 
     expect(r.id).toBeTruthy();
     expect(r.title).toEqual('title');
     expect(r.doneStatus).toEqual(false);
     expect(r.description).toEqual('description'); */
});
