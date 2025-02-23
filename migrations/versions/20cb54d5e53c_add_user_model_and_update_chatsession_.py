"""Add User model and update ChatSession and ChatMessage models

Revision ID: 20cb54d5e53c
Revises: 
Create Date: 2024-10-04 02:11:06.935828

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20cb54d5e53c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('chatbot_personalities',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('prompt_template', sa.Text(), nullable=False),
    sa.Column('color', sa.String(length=50), nullable=False),
    sa.Column('avatar', sa.String(length=200), nullable=False),
    sa.Column('example_conversation', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('interests',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('traits',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=80), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password_hash', sa.String(length=128), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('chat_sessions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('session_id', sa.String(length=36), nullable=False),
    sa.Column('personality_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['personality_id'], ['chatbot_personalities.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('session_id')
    )
    op.create_table('personality_interests',
    sa.Column('personality_id', sa.Integer(), nullable=False),
    sa.Column('interest_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['interest_id'], ['interests.id'], ),
    sa.ForeignKeyConstraint(['personality_id'], ['chatbot_personalities.id'], ),
    sa.PrimaryKeyConstraint('personality_id', 'interest_id')
    )
    op.create_table('personality_traits',
    sa.Column('personality_id', sa.Integer(), nullable=False),
    sa.Column('trait_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['personality_id'], ['chatbot_personalities.id'], ),
    sa.ForeignKeyConstraint(['trait_id'], ['traits.id'], ),
    sa.PrimaryKeyConstraint('personality_id', 'trait_id')
    )
    op.create_table('chat_messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('session_id', sa.Integer(), nullable=False),
    sa.Column('sender', sa.Enum('user', 'bot', name='sender_enum'), nullable=False),
    sa.Column('message', sa.Text(), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['session_id'], ['chat_sessions.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('chat_messages')
    op.drop_table('personality_traits')
    op.drop_table('personality_interests')
    op.drop_table('chat_sessions')
    op.drop_table('users')
    op.drop_table('traits')
    op.drop_table('interests')
    op.drop_table('chatbot_personalities')
    # ### end Alembic commands ###
