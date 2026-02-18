

const BASE_URL = 'http://localhost:5000/api/auth';

async function testAuth() {
    try {
        console.log('Testing Registration...');
        const registerRes = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'testuser_' + Date.now(),
                email: 'test_' + Date.now() + '@example.com',
                password: 'password123'
            })
        });

        const registerData = await registerRes.json();
        console.log('Register Status:', registerRes.status);
        console.log('Register Response:', registerData);

        if (registerRes.status !== 201) return;

        console.log('\nTesting Login...');
        const loginRes = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: registerData.user.email,
                password: 'password123'
            })
        });

        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status);
        console.log('Login Response:', loginData);

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testAuth();
