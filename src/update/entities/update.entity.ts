import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('updates')
export class Update {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    causeName: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    imageUrl: string;

    @CreateDateColumn()
    createdAt: Date;
}
