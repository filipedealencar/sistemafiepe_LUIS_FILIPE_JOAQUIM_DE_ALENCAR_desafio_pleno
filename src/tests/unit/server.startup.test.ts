import app from '../../app';

jest.mock('../../app', () => ({
  listen: jest.fn((_port: number, callback: () => void) => callback && callback()),
}));

describe('Server startup', () => {
  it('deve iniciar sem erros', async () => {
    await import('../../server');
    expect(app.listen).toHaveBeenCalled();
  });
});
