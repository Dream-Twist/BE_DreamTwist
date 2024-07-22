import { Column, 
    CreateDateColumn, 
    DeleteDateColumn, 
    Entity, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from "typeorm";
import { Users } from "../users/users.entity";



@Entity({ schema: 'example1', name: 'posts' })
export class Posts{
    @PrimaryGeneratedColumn({type:'int',name:'id'})
    id:number;

    @Column('varchar', {name:'title', length:30})
    title:string;  

    @Column('varchar', {name:'contents', length:100})
    contents:string;  

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date | null;

    @Column('int', { name: 'UserId', nullable: false })
    UserId: number | null;

    @ManyToOne(()=>Users,(users)=>users.id,{
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'postUserId', referencedColumnName: 'id' }])
    PostUserId: Users;
}