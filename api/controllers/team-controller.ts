import type { Request, Response } from 'express';
import { db } from '../configs/db';
import httpResponse from '../helpers/httpResponse';
import httpError from '../helpers/httpError';
import HttpStatus from 'http-status-codes';

class TeamController {
  async getTeams(req: Request, res: Response) {
    try {
      const teams = await db.team.findMany();

      const teamsWithUsername = await Promise.all(
        teams.map(async (team) => {
          const productOwner = await db.user.findUnique({
            where: {
              userId: team.productOwnerUserId!,
            },
            select: {
              username: true,
            },
          });
          const projectManager = await db.user.findUnique({
            where: {
              userId: team.projectManagerUserId!,
            },
            select: {
              username: true,
            },
          });

          return {
            ...team,
            productOwnerUsername: productOwner?.username,
            productManagerUsername: projectManager?.username,
          };
        })
      );

      return httpResponse.success(
        res,
        HttpStatus.OK,
        teamsWithUsername,
        'Teams retrieved successfully'
      );
    } catch (error) {
      if (error instanceof Error) {
        return httpError.internalServerError(res, error.message);
      } else {
        return httpError.internalServerError(res);
      }
    }
  }
}

export default new TeamController();
