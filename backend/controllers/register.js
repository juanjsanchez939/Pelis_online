import { UserService } from '../services/user.js';

export function register(app) {
  app.get(
    '/check-username',
    async (req, res) => {
      const username = req.query.username;
      if (!username || username.length < 3) {
        return res.json({ available: false });
      }
      const user = await UserService.getSingleOrNullByUsername(username);
      res.json({ available: !user });
    }
  );

  app.post(
    '/register',
    async (req, res) => {
      const user = await UserService.create(req.body);

      res.status(201).send({
        uuid: user.uuid,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        roles: user.roles,
      });
    }
  );
}
