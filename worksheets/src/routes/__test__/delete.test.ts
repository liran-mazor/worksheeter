import request from 'supertest';
import { app } from '../../app';

describe('DELETE /api/worksheets/:id', () => {
  it('returns 404 if the worksheet is not found', async () => {
    const id = '507f1f77bcf86cd799439011';
    await request(app)
      .delete(`/api/worksheets/${id}`)
      .set('Cookie', global.signin())
      .send()
      .expect(404);
  });

  it('deletes the worksheet successfully and returns 204', async () => {
    const userCookie = global.signin();
    
    const response = await request(app)
      .post('/api/worksheets')
      .set('Cookie', userCookie)
      .send({ 
        title: 'Worksheet to Delete', 
        keywords: ['test', 'delete'], 
        questions: ['Will this be deleted?'] 
      })
      .expect(201);

    await request(app)
      .delete(`/api/worksheets/${response.body.id}`)
      .set('Cookie', userCookie)
      .send()
      .expect(204);
  });

  it('prevents other users from deleting worksheets they do not own', async () => {
    const userOneCookie = global.signin();
    const userTwoCookie = global.signin();
    
    // User One creates a worksheet
    const response = await request(app)
      .post('/api/worksheets')
      .set('Cookie', userOneCookie)
      .send({ 
        title: 'Private Worksheet', 
        keywords: ['private'], 
        questions: ['Can others delete this?'] 
      })
      .expect(201);

    // User Two tries to delete User One's worksheet
    await request(app)
      .delete(`/api/worksheets/${response.body.id}`)
      .set('Cookie', userTwoCookie)
      .send()
      .expect(401);
  });
});