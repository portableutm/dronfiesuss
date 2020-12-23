import { getRepository } from "typeorm";
import { VehicleReg } from "../entities/VehicleReg";

export class VehicleDao {

    private repository = getRepository(VehicleReg);

    async all() {
        return this.repository.find();
    }

    async allByUser(username) {
        return this.repository.find({
            where: {
                owner: username
            }
        });
    }

    async vehiclesByOperator(username) {
        return this.repository
            .createQueryBuilder("vehicle_reg")
            .leftJoinAndSelect("vehicle_reg.dinacia_vehicle", "dinacia_vehicle")
            .innerJoinAndSelect("vehicle_reg.operators", "operator")
            .leftJoinAndSelect("operator.dinacia_user", "dinacia_user")
            .leftJoinAndSelect("dinacia_user.dinacia_company", "dinacia_company")
            .where("operator.\"username\" = :username")
            .setParameters({
                username: username
            })
            .getMany()
    }

    async one(id: string) {
        // console.log(`Dao vehiculo::id>${id}<`)
        let v = await this.repository.findOneOrFail(id);
        // let vehiculos = this.repository.find({
        //     where: [
        //       { uvin: id},
        //     ]
        //   });
        // let v = vehiculos[0]
        // console.log(`Dao vehiculo::vehicle>${JSON.stringify(v)}<`)
        return v;
    }

    async oneByUser(id: string, username: string) {
        // console.log(`Dao vehiculo::id>${id}<`)
        let v = await this.repository.findOneOrFail(id, {
            where: {
                owner: username
            }
        });
        // let vehiculos = this.repository.find({
        //     where: [
        //       { uvin: id},
        //     ]
        //   });
        // let v = vehiculos[0]
        // console.log(`Dao vehiculo::vehicle>${JSON.stringify(v)}<`)
        return v;
    }

    async save(vehicle: VehicleReg) {
        // console.log(`${JSON.stringify(vehicle)}`)
        return this.repository.save(vehicle);
    }

    async remove(id: number) {
        let userToRemove = await this.repository.findOne(id);
        await this.repository.remove(userToRemove);
    }



    async countDinaciaVehiclesByYear(year) {
        return this.repository
            .createQueryBuilder("vehicle_reg")
            .innerJoinAndSelect("vehicle_reg.dinacia_vehicle", "dinacia_vehicle")
            .where("dinacia_vehicle.\"year\" = :year")
            .setParameters({
                year: year
            })
            .getCount()

    }



}