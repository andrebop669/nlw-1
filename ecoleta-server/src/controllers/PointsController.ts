import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
        const trx = await knex.transaction();
        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }
        const insertedIds = await trx('points').insert(point);
        const point_id = insertedIds[0];
        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id: point_id
                }
            });
        await trx('point_items').insert(pointItems)
        await trx.commit();
        return response.json({
            id: point_id,
            ...point
        });
    }

    async show(request: Request, response: Response) {
        const id = Number(request.params.id);
        const point = await knex('points').select('*').where('id', '=', id).first();
        const items = await knex('items')
            .select('items.id', 'items.title', 'items.image')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', '=', id);

            const serializedPoint = {
                   ...point,
                   image_url: `http://192.168.0.11:3333/uploads/${point.image}`,
            }
        return response.json({ serializedPoint, items });
    }

    async query(request: Request, response: Response) {
        const { city, uf, items } = request.query;
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));
        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('points.city', String(city).trim())
            .where('points.uf', String(uf).trim())
            .distinct()
            .select('points.*');
        
            const serializedPoints = points.map(point => {
                return {
                   ...point,
                   image_url: `http://192.168.0.11:3333/uploads/${point.image}`,
                };
            })

        return response.json(serializedPoints);
    }

}

export default PointsController;

