import {test, expect, APIResponse} from '@playwright/test';

test.describe('API CRUD test', () => {
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
});

let myDeck = '';

/**
 * A function to check if the API request returned a successfull response
 * @param { APIResponse } response Target API 
 * @returns { Promise<void> }
 */
async function checkIfSuccess ( response:APIResponse ): Promise<void> {
        // Check if response is valid
        expect(response.ok()).toBeTruthy();
};

test('Deck of Cards API', async ({ request }) => {
    await test.step('Create a new deck ', async () => {

        // Initialize a new deck
        const newDeck = await request.get('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const deckInfo = await newDeck.json();
        // console.log(deckInfo);

        // Check if deck is successfully created
        await checkIfSuccess(newDeck);

        // Getdeck id
        myDeck = deckInfo.deck_id;
        // console.log(myDeck);
    });

    await test.step('Sort the deck', async() => {
        
        // Draw all cards the deck
        const drawAllCards = await request.get(`https://www.deckofcardsapi.com/api/deck/${myDeck}/draw/?count=52`);
        let deckInfo = await drawAllCards.json();
        // console.log(deckInfo);

        // Check if request returned a successfull response
        await checkIfSuccess(drawAllCards);

        // Check if deck is empty
        expect(deckInfo.remaining).toBe(0);

        // Return cards sorted
        const returnCards = await request.get(`https://www.deckofcardsapi.com/api/deck/${myDeck}/return/?cards=as,2s,3s,4s,5s,6s,7s,8s,9s,0s,js,qs,ks,ad,2d,3d,4d,5d,6d,7d,8d,9d,0d,jd,qd,kd,ac,2c,3c,4c,5c,6c,7c,8c,9c,0c,jc,qc,kc,ah,2h,3h,4h,5h,6h,7h,8h,9h,0h,jh,qh,kh`);
        deckInfo = await returnCards.json();
        // console.log(deckInfo);

        // Check if request returned a successfull response
        await checkIfSuccess(returnCards);

        // Check if deck has complete cards
        expect(deckInfo.remaining).toBe(52);
    });

    await test.step('Create a pile of 5 cards ', async() => {
        // Create first pile of 5
        const firstPile = await request.get(`https://www.deckofcardsapi.com/api/deck/${myDeck}/pile/pile1/add/?cards=as,2s,3s,4s,5s`);
        const deckInfo = await firstPile.json();
        console.log(deckInfo);

        // Check if request returned a successfull response
        await checkIfSuccess(firstPile);

        // Check if first pile has 5 cards
        expect(deckInfo.piles.pile1.remaining).toBe(5);

        // Check if deck has the correct number of remaining cards
        expect(deckInfo.remaining).toBe(47);
    });

    await test.step('Create another pile of 5 cards', async() => {
        // Create second pile of 5
        const secondPile = await request.get(`https://www.deckofcardsapi.com/api/deck/${myDeck}/pile/pile2/add/?cards=6s,7s,8s,9s,0s`);
        const deckInfo = await secondPile.json();
        // console.log(`Pile 1: ${deckInfo}`);

        // Check if request returned a successfull response
        await checkIfSuccess(secondPile);

        // Check if first pile has 5 cards
        expect(deckInfo.piles.pile2.remaining).toBe(5);

        // Check if deck has the correct number of remaining cards
        expect(deckInfo.remaining).toBe(42);
    });

    await test.step('Shuffle first pile ', async() => {
        // Shuffle pile1
        const shuffleFirstPile = await request.get(`https://www.deckofcardsapi.com/api/deck/${myDeck}/pile/pile1/shuffle/`);
        const deckInfo = await shuffleFirstPile.json();
        // console.log(`Pile 1: ${deckInfo}`);

        // Check if request returned a successfull response
        await checkIfSuccess(shuffleFirstPile);

        // Check if first pile still has 5 cards
        expect(deckInfo.piles.pile1.remaining).toBe(5);
    });

    await test.step('Draw 3 cards from first pile ', async() => {
        // Draw 3 from pile1
        const drawFromPile1 = await request.get(`https://www.deckofcardsapi.com/api/deck/${myDeck}/pile/pile1/draw/random/?count=3`);
        const deckInfo = await drawFromPile1.json();
        // console.log(`Pile 1: ${deckInfo}`);

        // Check if request returned a successfull response
        await checkIfSuccess(drawFromPile1);

        // Check if first pile now only has 2 cards
        expect(deckInfo.piles.pile1.remaining).toBe(2);
    });

    await test.step('Draws 2 cards from second pile ', async() => {
        // Draw 2 from pile2
        const drawFromPile2 = await request.get(`https://www.deckofcardsapi.com/api/deck/${myDeck}/pile/pile2/draw/random/?count=2`);
        const deckInfo = await drawFromPile2.json();
        // cog(nsole.lo`Pile 2: ${deckInfo}`);

        // Check if request returned a successfull response
        await checkIfSuccess(drawFromPile2);

        // Check if first pile now only has 2 cards
        expect(deckInfo.piles.pile2.remaining).toBe(3);
    });
});