import {test, expect} from '@playwright/test';

test('API CREATE test', async ({ request }) => {
    const postResponse = await request.post('https://reqres.in/api/users/1', {
        data: {
            name: "test123",
            hobby: "Building toy models"
        }});

    const body = await postResponse.json();

    // Assert created data
    expect(body.name).toBe('test123');
    expect(body.hobby).toBe('Building toy models');

    // Assert http response status
    expect(postResponse.status()).toBe(201);
});

test('API READ test', async ({ request }) => {
    const getResponse = await request.get('https://reqres.in/api/users/1');
    const body = await getResponse.json();

    // Assert queried user id
    expect(body.data.id).toBe(1);

    // Assert http reponse status
    expect(getResponse.status()).toBe(200);
});

test('API UPDATE test', async ({ request }) => {
    const putResponse = await request.put('https://reqres.in/api/users/1', {
        data: {
        "name": "test123",
        "hobby": "Automating stuff"
    }});
    const body = await putResponse.json();

    // Assert updated data
    expect(body.name).toBe('test123');
    expect(body.hobby).toBe('Automating stuff');

    // Assert http reponse status
    expect(putResponse.status()).toBe(200);
});

test('API DELETE test', async ({ request }) => {
    const deleteResponse = await request.delete('https://reqres.in/api/users/1');

    // Assert http reponse status
    expect(deleteResponse.status()).toBe(204);
});