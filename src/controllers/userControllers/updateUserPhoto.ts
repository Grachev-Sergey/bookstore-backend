import type { Handler } from 'express';
import * as jwt from 'jsonwebtoken';
import * as fs from 'node:fs/promises';
import * as Uuid from 'Uuid';
import { config } from '../../config';
import { repositorys } from '../../db';

export const updateUserPhoto: Handler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, config.token.secretKey) as { id: number };
    const user = await repositorys.userRepository.findOneBy({ id: payload.id });

    const { avatar } = req.body;
    const avatarData = avatar.split('base64,')[1];
    const avatarType = avatar.split(';')[0].split('/')[1];
    const randomName = Uuid.v4();
    const avatarName = `${randomName}.${avatarType}`;
    const route = `static/${avatarName}`;

    fs.writeFile(route, avatarData, { encoding: 'base64' });
    const avatarRoute = `http://localhost:4000/${avatarName}`;
    user.avatar = avatarRoute;
    await repositorys.userRepository.save(user);
    return res.json({ user, message: config.apiMessage.UPDATE_USER });
  } catch (err) {
    next(err);
  }
};
