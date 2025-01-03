import { faker } from '@faker-js/faker';

describe('GoREST API Automation', () => {
    const baseUrl = 'https://gorest.co.in/public/v2/users';
    const token = '3d09b54dd7993566bf9a0f143b8cf5052d6268bd8be4a1365237be702a049761';
    let userId;
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const userName = faker.person.fullName();
    const userEmail = faker.internet.email();
    const updatedName = faker.person.fullName();
    const updatedEmail = faker.internet.email();

    it('should create a new user', () => {
        cy.request({
            method: 'POST',
            url: baseUrl,
            headers,
            body: {
                name: userName,
                gender: 'male',
                email: userEmail,
                status: 'active',
            },
        }).then((response) => {
            expect(response.status, 'Expected status code to be 201').to.eq(201);
            expect(response.body).to.have.property('id');
            expect(response.body.name).to.eq(userName);
            expect(response.body.email).to.eq(userEmail);
            expect(response.body.status).to.eq('active');
            userId = response.body.id;
        });
    });

    it('should retrieve the created user', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/${userId}`,
            headers,
        }).then((response) => {
            expect(response.status, 'Expected status code to be 200').to.eq(200);
            expect(response.body.id).to.eq(userId);
            expect(response.body.name).to.eq(userName);
            expect(response.body.email).to.eq(userEmail);
            expect(response.body.status).to.eq('active');
        });
    });

    it('should update the user details', () => {
        cy.request({
            method: 'PATCH',
            url: `${baseUrl}/${userId}`,
            headers,
            body: {
                name: updatedName,
                email: updatedEmail,
                status: 'active',
            },
        }).then((response) => {
            expect(response.status, 'Expected status code to be 200').to.eq(200);
            expect(response.body.name).to.eq(updatedName);
            expect(response.body.email).to.eq(updatedEmail);
            expect(response.body.status).to.eq('active');
        });

        cy.request({
            method: 'GET',
            url: `${baseUrl}/${userId}`,
            headers,
        }).then((response) => {
            expect(response.status, 'Expected status code to be 200').to.eq(200);
            expect(response.body.name).to.eq(updatedName);
            expect(response.body.email).to.eq(updatedEmail);
            expect(response.body.status).to.eq('active');
        });
    });


    it('should delete the user', () => {
        cy.request({
            method: 'DELETE',
            url: `${baseUrl}/${userId}`,
            headers,
        }).then((response) => {
            expect(response.status, 'Expected status code to be 204').to.eq(204);
        });

        cy.request({
            method: 'GET',
            url: `${baseUrl}/${userId}`,
            headers,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status, 'Expected status code to be 404').to.eq(404);
        });
    });
});

