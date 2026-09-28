import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('contacts')
export class ContactEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    subject: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ default: 'open' })
    status: string;

    @Column({ type: 'text', nullable: true })
    adminNote: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}